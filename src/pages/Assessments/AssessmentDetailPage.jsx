import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Save,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Copy,
  Move,
  Settings,
  FileText,
  CheckCircle,
  Circle,
  Square,
  Type,
  Hash,
  Upload
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useJobsApi, useAssessmentsApi } from '../../hooks/useApi.js';
import { useApp } from '../../contexts/AppContext.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import Badge from '../../components/common/Badge.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { QUESTION_TYPES } from '../../types/index.js';

// Question Type Icons
const QuestionTypeIcon = ({ type }) => {
  const icons = {
    [QUESTION_TYPES.SINGLE_CHOICE]: <Circle size={16} />,
    [QUESTION_TYPES.MULTI_CHOICE]: <CheckCircle size={16} />,
    [QUESTION_TYPES.SHORT_TEXT]: <Type size={16} />,
    [QUESTION_TYPES.LONG_TEXT]: <FileText size={16} />,
    [QUESTION_TYPES.NUMERIC_RANGE]: <Hash size={16} />,
    [QUESTION_TYPES.FILE_UPLOAD]: <Upload size={16} />,
  };
  return icons[type] || <Type size={16} />;
};

// Question Type Labels
const getQuestionTypeLabel = (type) => {
  const labels = {
    [QUESTION_TYPES.SINGLE_CHOICE]: 'Single Choice',
    [QUESTION_TYPES.MULTI_CHOICE]: 'Multiple Choice',
    [QUESTION_TYPES.SHORT_TEXT]: 'Short Text',
    [QUESTION_TYPES.LONG_TEXT]: 'Long Text',
    [QUESTION_TYPES.NUMERIC_RANGE]: 'Numeric Range',
    [QUESTION_TYPES.FILE_UPLOAD]: 'File Upload',
  };
  return labels[type] || 'Unknown';
};

const AssessmentDetailPage = () => {
  const { jobId } = useParams();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';
  
  const { fetchJobs } = useJobsApi();
  const { fetchAssessment, saveAssessment } = useAssessmentsApi();
  const { actions } = useApp();
  
  const [job, setJob] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState('builder'); // 'builder' or 'preview'

  useEffect(() => {
    loadData();
  }, [jobId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load job details
      const jobsResponse = await fetchJobs({ pageSize: 100 });
      const jobData = jobsResponse.data?.find(j => j.id === parseInt(jobId));
      if (!jobData) {
        throw new Error('Job not found');
      }
      setJob(jobData);
      
      // Load assessment if it exists
      try {
        const assessmentData = await fetchAssessment(jobId);
        setAssessment(assessmentData);
      } catch (error) {
        // Assessment doesn't exist yet, create empty structure
        setAssessment({
          title: `${jobData.title} Assessment`,
          description: `Assessment for ${jobData.title} position`,
          sections: []
        });
      }
    } catch (error) {
      actions.addNotification({
        type: 'error',
        title: 'Load Failed',
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const addSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      questions: []
    };
    
    setAssessment(prev => ({
      ...prev,
      sections: [...(prev.sections || []), newSection]
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await saveAssessment(jobId, assessment);
      actions.addNotification({
        type: 'success',
        title: 'Assessment Saved',
        message: 'Assessment has been saved successfully',
      });
    } catch (error) {
      actions.addNotification({
        type: 'error',
        title: 'Save Failed',
        message: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-gray-500">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Not Found</h2>
        <p className="text-gray-600 mb-6">The job you are looking for does not exist.</p>
        <Link to="/assessments">
          <Button icon={<ArrowLeft size={16} />}>
            Back to Assessments
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/app/assessments">
            <Button variant="outline" icon={<ArrowLeft size={16} />}>
              Back to Assessments
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {assessment?.title || `${job.title} Assessment`}
            </h1>
            <p className="text-gray-600">for {job.title}</p>
          </div>
        </div>
        
        {!isPreview && (
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
              <Button
                variant={viewMode === 'builder' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('builder')}
                icon={<Settings size={16} />}
                className="px-3"
              >
                Builder
              </Button>
              <Button
                variant={viewMode === 'preview' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('preview')}
                icon={<Eye size={16} />}
                className="px-3"
              >
                Preview
              </Button>
            </div>
            
            <Button
              onClick={handleSave}
              loading={saving}
              icon={<Save size={16} />}
            >
              Save Assessment
            </Button>
          </div>
        )}
      </div>

      {/* Assessment Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Assessment Details</h3>
            <p className="text-gray-600 mb-4">
              {assessment?.description || 'No description provided'}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{assessment?.sections?.length || 0} sections</span>
              <span>
                {assessment?.sections?.reduce((total, section) => 
                  total + (section.questions?.length || 0), 0
                ) || 0} questions
              </span>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Job Information</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Position:</strong> {job.title}</div>
              <div><strong>Location:</strong> {job.location}</div>
              <div><strong>Type:</strong> {job.type}</div>
              <div><strong>Status:</strong> 
                <Badge variant={job.status} size="sm" className="ml-2">
                  {job.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Builder/Preview Content */}
      {viewMode === 'builder' && !isPreview ? (
        <div className="space-y-6">
          {/* Sections */}
          {assessment?.sections?.length > 0 ? (
            <div className="space-y-4">
              {assessment.sections.map((section) => (
                <div key={section.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {section.title || 'Untitled Section'}
                        </h3>
                        <Badge variant="default" size="sm">
                          {section.questions?.length || 0} questions
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {/* Add question logic */}}
                          icon={<Plus size={16} />}
                        >
                          Add Question
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Trash2 size={16} />}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {section.questions?.length > 0 ? (
                      <div className="space-y-4">
                        {section.questions.map((question, index) => (
                          <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <div className="flex-shrink-0 mt-1">
                                  <QuestionTypeIcon type={question.type} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="font-medium text-gray-900">
                                      {question.title || 'Untitled Question'}
                                    </h4>
                                    {question.required && (
                                      <Badge variant="destructive" size="sm">Required</Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    {getQuestionTypeLabel(question.type)}
                                    {question.options && ` • ${question.options.length} options`}
                                    {question.maxLength && ` • Max ${question.maxLength} chars`}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  icon={<Edit size={16} />}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  icon={<Trash2 size={16} />}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FileText size={32} className="mx-auto mb-2 text-gray-300" />
                        <p>No questions in this section yet</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {/* Add question logic */}}
                          icon={<Plus size={16} />}
                          className="mt-2"
                        >
                          Add First Question
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Sections Yet</h3>
              <p className="text-gray-600 mb-6">Start building your assessment by adding sections and questions.</p>
              <Button onClick={addSection} icon={<Plus size={20} />}>
                Add First Section
              </Button>
            </div>
          )}
          
          {/* Add Section Button */}
          {assessment?.sections?.length > 0 && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={addSection}
                icon={<Plus size={20} />}
              >
                Add Section
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Preview Mode */
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Eye size={20} className="text-blue-600 mr-2" />
              <h3 className="text-lg font-medium text-blue-900">Assessment Preview</h3>
            </div>
            <p className="text-blue-700 mt-1">
              This is how candidates will see the assessment. All questions are read-only in preview mode.
            </p>
          </div>
          
          {assessment?.sections?.length > 0 ? (
            <div className="space-y-6">
              {assessment.sections.map((section) => (
                <div key={section.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                      {section.title || 'Untitled Section'}
                    </h3>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    {section.questions?.map((question) => (
                      <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            <QuestionTypeIcon type={question.type} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium text-gray-900">
                                {question.title || 'Untitled Question'}
                              </h4>
                              {question.required && (
                                <Badge variant="destructive" size="sm">Required</Badge>
                              )}
                            </div>
                            
                            {/* Preview of question based on type */}
                            {question.type === QUESTION_TYPES.SINGLE_CHOICE && (
                              <div className="space-y-2">
                                {question.options?.map((option, index) => (
                                  <label key={index} className="flex items-center space-x-2">
                                    <input type="radio" disabled className="text-primary-600" />
                                    <span className="text-sm text-gray-700">{option}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                            
                            {question.type === QUESTION_TYPES.MULTI_CHOICE && (
                              <div className="space-y-2">
                                {question.options?.map((option, index) => (
                                  <label key={index} className="flex items-center space-x-2">
                                    <input type="checkbox" disabled className="text-primary-600" />
                                    <span className="text-sm text-gray-700">{option}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                            
                            {question.type === QUESTION_TYPES.SHORT_TEXT && (
                              <input
                                type="text"
                                disabled
                                placeholder="Short text answer..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                              />
                            )}
                            
                            {question.type === QUESTION_TYPES.LONG_TEXT && (
                              <textarea
                                disabled
                                placeholder="Long text answer..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 h-20"
                              />
                            )}
                            
                            {question.type === QUESTION_TYPES.NUMERIC_RANGE && (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  disabled
                                  placeholder={question.min || 'Min'}
                                  className="w-20 px-2 py-1 border border-gray-300 rounded bg-gray-50"
                                />
                                <span className="text-gray-500">to</span>
                                <input
                                  type="number"
                                  disabled
                                  placeholder={question.max || 'Max'}
                                  className="w-20 px-2 py-1 border border-gray-300 rounded bg-gray-50"
                                />
                              </div>
                            )}
                            
                            {question.type === QUESTION_TYPES.FILE_UPLOAD && (
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">File upload area</p>
                                {question.acceptedTypes && (
                                  <p className="text-xs text-gray-400 mt-1">
                                    Accepted: {question.acceptedTypes.join(', ')}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Assessment Content</h3>
              <p className="text-gray-600">Add sections and questions to see the preview.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssessmentDetailPage;