import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Play, Clock, Users, Award, Plus, Edit, Eye } from 'lucide-react';
import assessmentsData from '../../data/assessments.js';

const AssessmentsPage = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState(() => {
    // map centralized data to existing card structure fields
    return assessmentsData.map(a => ({
      id: a.id,
      title: a.title,
      description: a.description,
      duration: a.duration,
      difficulty: a.difficulty,
      color: a.color || '#3B82F6',
      questions: a.questions.length,
      questionsList: a.questions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
        correct: q.correct
      }))
    }));
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [newAssessment, setNewAssessment] = useState({
    title: '',
    description: '',
    questions: 0,
    duration: '',
    difficulty: 'Beginner',
    questionsList: []
  });

  // Demo admin role - in real app this would come from authentication
  const isAdmin = true; // Set to false to test user view

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartAssessment = (assessmentId) => {
    navigate(`/assessment/${assessmentId}`);
  };

  const handleCreateAssessment = () => {
    setNewAssessment({
      title: '',
      description: '',
      questions: 0,
      duration: '',
      difficulty: 'Beginner',
      questionsList: []
    });
    setShowCreateModal(true);
  };

  const handleEditAssessment = (assessment) => {
    setEditingAssessment(assessment);
    setNewAssessment({
      title: assessment.title,
      description: assessment.description,
      questions: assessment.questions,
      duration: assessment.duration,
      difficulty: assessment.difficulty,
      questionsList: assessment.questionsList
    });
    setShowEditModal(true);
  };

  const handleSaveAssessment = () => {
    if (editingAssessment) {
      // Update existing assessment
      setAssessments(assessments.map(assessment => 
        assessment.id === editingAssessment.id 
          ? { ...assessment, ...newAssessment, questions: newAssessment.questionsList.length }
          : assessment
      ));
      setShowEditModal(false);
      setEditingAssessment(null);
    } else {
      // Create new assessment
      const newId = Math.max(...assessments.map(a => a.id)) + 1;
      const assessment = {
        ...newAssessment,
        id: newId,
        questions: newAssessment.questionsList.length,
        color: '#3B82F6'
      };
      setAssessments([...assessments, assessment]);
      setShowCreateModal(false);
    }
    setNewAssessment({
      title: '',
      description: '',
      questions: 0,
      duration: '',
      difficulty: 'Beginner',
      questionsList: []
    });
  };

  const handleCancel = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingAssessment(null);
    setNewAssessment({
      title: '',
      description: '',
      questions: 0,
      duration: '',
      difficulty: 'Beginner',
      questionsList: []
    });
  };

  const addQuestion = () => {
    const newQuestion = {
      id: newAssessment.questionsList.length + 1,
      question: '',
      options: ['', '', '', ''],
      correct: 0
    };
    setNewAssessment({
      ...newAssessment,
      questionsList: [...newAssessment.questionsList, newQuestion]
    });
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...newAssessment.questionsList];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setNewAssessment({
      ...newAssessment,
      questionsList: updatedQuestions
    });
  };

  const updateQuestionOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...newAssessment.questionsList];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setNewAssessment({
      ...newAssessment,
      questionsList: updatedQuestions
    });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = newAssessment.questionsList.filter((_, i) => i !== index);
    setNewAssessment({
      ...newAssessment,
      questionsList: updatedQuestions
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-600 p-6">
      <div className="max-w-7xl mx-auto">
      {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-4">Assessments</h1>
          <p className="text-xl text-white/90">Choose an assessment to test your skills</p>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="mb-8 animate-fade-in">
            <button
              onClick={handleCreateAssessment}
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Assessment</span>
            </button>
          </div>
        )}

        {/* Assessments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((assessment, index) => (
            <motion.div
              key={assessment.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
              className="bg-white rounded-2xl shadow-2xl p-6 transition-all duration-300 h-96 flex flex-col justify-between"
            >
              {/* Assessment Header */}
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: assessment.color }}>
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{assessment.title}</h3>
        </div>
      </div>

              {/* Assessment Description */}
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">{assessment.description}</p>

              {/* Assessment Details */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{assessment.questions} Questions</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{assessment.duration}</span>
                </div>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(assessment.difficulty)}`}>
                    <Award className="w-3 h-3 mr-1" />
                    {assessment.difficulty}
                  </span>
                </div>
      </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleStartAssessment(assessment.id)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Start</span>
                </button>
                {isAdmin && (
                  <button
                    onClick={() => handleEditAssessment(assessment)}
                    className="bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Create/Edit Assessment Modal */}
        {(showCreateModal || showEditModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {showEditModal ? 'Edit Assessment' : 'Create New Assessment'}
                </h2>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={newAssessment.title}
                        onChange={(e) => setNewAssessment({...newAssessment, title: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Assessment title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                      <input
                        type="text"
                        value={newAssessment.duration}
                        onChange={(e) => setNewAssessment({...newAssessment, duration: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 30 minutes"
                      />
                    </div>
                    </div>
                    
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={newAssessment.description}
                      onChange={(e) => setNewAssessment({...newAssessment, description: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                      placeholder="Assessment description"
                    />
                      </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                    <select
                      value={newAssessment.difficulty}
                      onChange={(e) => setNewAssessment({...newAssessment, difficulty: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  
                  {/* Questions */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
                      <button
                        onClick={addQuestion}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Question</span>
                      </button>
                    </div>

                    <div className="space-y-6">
                      {newAssessment.questionsList.map((question, qIndex) => (
                        <div key={qIndex} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-gray-900">Question {qIndex + 1}</h4>
                            <button
                              onClick={() => removeQuestion(qIndex)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                              <input
                                type="text"
                                value={question.question}
                                onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter question"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                              <div className="space-y-2">
                                {question.options.map((option, oIndex) => (
                                  <div key={oIndex} className="flex items-center space-x-3">
                                    <input
                                      type="radio"
                                      name={`correct-${qIndex}`}
                                      checked={question.correct === oIndex}
                                      onChange={() => updateQuestion(qIndex, 'correct', oIndex)}
                                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <input
                                      type="text"
                                      value={option}
                                      onChange={(e) => updateQuestionOption(qIndex, oIndex, e.target.value)}
                                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder={`Option ${oIndex + 1}`}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Modal Actions */}
                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAssessment}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-200"
                  >
                    {showEditModal ? 'Save Changes' : 'Create Assessment'}
                  </button>
                      </div>
                      </div>
                    </div>
                  </div>
                )}

        {/* Empty State */}
        {assessments.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-white mb-2">No Assessments Available</h3>
              <p className="text-white/80">Check back later for new assessments.</p>
              </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentsPage;