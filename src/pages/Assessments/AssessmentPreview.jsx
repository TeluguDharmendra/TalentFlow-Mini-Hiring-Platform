import { useState } from 'react';
import { Check, X } from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import Badge from '../../components/common/Badge.jsx';
import { QUESTION_TYPES } from '../../types/index.js';

const QuestionPreview = ({ question, value, onChange, errors = {} }) => {
  const handleChange = (newValue) => {
    onChange(question.id, newValue);
  };

  const renderQuestion = () => {
    switch (question.type) {
      case QUESTION_TYPES.SINGLE_CHOICE:
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={index}
                  checked={value === index}
                  onChange={() => handleChange(index)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case QUESTION_TYPES.MULTI_CHOICE:
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={index}
                  checked={selectedValues.includes(index)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleChange([...selectedValues, index]);
                    } else {
                      handleChange(selectedValues.filter(v => v !== index));
                    }
                  }}
                  className="text-primary-600 focus:ring-primary-500 rounded"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case QUESTION_TYPES.SHORT_TEXT:
        return (
          <Input
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Enter your answer..."
            maxLength={question.maxLength}
            error={errors[question.id]}
          />
        );

      case QUESTION_TYPES.LONG_TEXT:
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Enter your detailed answer..."
            rows={6}
            maxLength={question.maxLength}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        );

      case QUESTION_TYPES.NUMERIC_RANGE:
        return (
          <div className="space-y-2">
            <Input
              type="number"
              value={value || ''}
              onChange={(e) => handleChange(parseInt(e.target.value))}
              placeholder="Enter a number..."
              min={question.min}
              max={question.max}
              error={errors[question.id]}
            />
            {(question.min !== undefined || question.max !== undefined) && (
              <p className="text-sm text-gray-500">
                {question.min !== undefined && question.max !== undefined
                  ? `Range: ${question.min} - ${question.max}`
                  : question.min !== undefined
                  ? `Minimum: ${question.min}`
                  : `Maximum: ${question.max}`
                }
              </p>
            )}
          </div>
        );

      case QUESTION_TYPES.FILE_UPLOAD:
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-300 transition-colors">
            <div className="space-y-2">
              <p className="text-gray-600">Click to upload or drag and drop</p>
              {question.acceptedTypes && (
                <p className="text-sm text-gray-500">
                  Accepted formats: {question.acceptedTypes.join(', ')}
                </p>
              )}
            </div>
          </div>
        );

      default:
        return <p className="text-gray-500">Unsupported question type</p>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-2">
        <h3 className="text-lg font-medium text-gray-900 flex-1">
          {question.title}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </h3>
        <Badge variant="default" size="sm" className="flex-shrink-0">
          {question.type.replace('_', ' ')}
        </Badge>
      </div>
      
      {question.description && (
        <p className="text-gray-600 text-sm">{question.description}</p>
      )}
      
      {renderQuestion()}
      
      {errors[question.id] && (
        <p className="text-sm text-red-600">{errors[question.id]}</p>
      )}
    </div>
  );
};

const AssessmentPreview = ({ assessment, onSubmit, loading = false }) => {
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState({});

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors(prev => ({
        ...prev,
        [questionId]: null
      }));
    }
  };

  const validateResponses = () => {
    const newErrors = {};

    assessment.sections?.forEach(section => {
      section.questions?.forEach(question => {
        const value = responses[question.id];
        
        // Check required fields
        if (question.required) {
          if (value === undefined || value === null || value === '' || 
              (Array.isArray(value) && value.length === 0)) {
            newErrors[question.id] = 'This field is required';
          }
        }
        
        // Check numeric range
        if (question.type === QUESTION_TYPES.NUMERIC_RANGE && value !== undefined && value !== '') {
          const num = parseInt(value);
          if (question.min !== undefined && num < question.min) {
            newErrors[question.id] = `Value must be at least ${question.min}`;
          }
          if (question.max !== undefined && num > question.max) {
            newErrors[question.id] = `Value cannot exceed ${question.max}`;
          }
        }
        
        // Check text length
        if ((question.type === QUESTION_TYPES.SHORT_TEXT || question.type === QUESTION_TYPES.LONG_TEXT) 
            && question.maxLength && value && value.length > question.maxLength) {
          newErrors[question.id] = `Text cannot exceed ${question.maxLength} characters`;
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateResponses()) {
      onSubmit(responses);
    }
  };

  const shouldShowQuestion = (question) => {
    if (!question.dependsOn) return true;
    
    const dependsOnValue = responses[question.dependsOn];
    const conditional = assessment.sections
      ?.flatMap(s => s.questions)
      ?.find(q => q.id === question.dependsOn)?.conditional;
    
    if (!conditional) return true;
    
    return dependsOnValue === conditional.showIfAnswer;
  };

  if (!assessment || !assessment.sections) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No assessment data available</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{assessment.title}</h1>
        {assessment.description && (
          <p className="text-gray-600 mt-2">{assessment.description}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {assessment.sections.map((section, sectionIndex) => (
          <div key={section.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {sectionIndex + 1}. {section.title}
            </h2>
            
            <div className="space-y-8">
              {section.questions
                ?.filter(shouldShowQuestion)
                ?.map((question, questionIndex) => (
                <div key={question.id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                  <div className="mb-2">
                    <span className="text-sm text-gray-500 font-medium">
                      Question {questionIndex + 1}
                    </span>
                  </div>
                  <QuestionPreview
                    question={question}
                    value={responses[question.id]}
                    onChange={handleResponseChange}
                    errors={errors}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            size="lg"
          >
            Submit Assessment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AssessmentPreview;