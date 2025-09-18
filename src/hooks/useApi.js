import { useState, useCallback } from 'react';
import { useApp } from '../contexts/AppContext.jsx';

// Custom hook for API calls
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { actions } = useApp();

  const makeRequest = useCallback(async (requestFn, options = {}) => {
    const { 
      showGlobalLoading = false, 
      showNotification = true,
      successMessage = null,
      errorMessage = null,
    } = options;

    try {
      setLoading(true);
      setError(null);
      
      if (showGlobalLoading) {
        actions.setLoading(true);
      }

      const response = await requestFn();
      
      if (successMessage && showNotification) {
        actions.addNotification({
          type: 'success',
          title: 'Success',
          message: successMessage,
        });
      }

      return response;
    } catch (err) {
      const message = errorMessage || err.message || 'An error occurred';
      setError(message);
      
      if (showNotification) {
        actions.addNotification({
          type: 'error',
          title: 'Error',
          message,
        });
      }
      
      throw err;
    } finally {
      setLoading(false);
      if (showGlobalLoading) {
        actions.setLoading(false);
      }
    }
  }, [actions]);

  return { loading, error, makeRequest };
};

// Jobs API hook
export const useJobsApi = () => {
  const { makeRequest } = useApi();

  const fetchJobs = useCallback(async (params = {}) => {
    return makeRequest(async () => {
      const queryParams = new URLSearchParams(params).toString();
      const response = await fetch(`/api/jobs?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch jobs');
      return response.json();
    });
  }, [makeRequest]);

  const createJob = useCallback(async (jobData) => {
    return makeRequest(async () => {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create job');
      }
      return response.json();
    }, {
      successMessage: 'Job created successfully',
      errorMessage: 'Failed to create job',
    });
  }, [makeRequest]);

  const updateJob = useCallback(async (jobId, updates) => {
    return makeRequest(async () => {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update job');
      }
      return response.json();
    }, {
      successMessage: 'Job updated successfully',
      errorMessage: 'Failed to update job',
    });
  }, [makeRequest]);

  const reorderJob = useCallback(async (jobId, newOrder) => {
    return makeRequest(async () => {
      const response = await fetch(`/api/jobs/${jobId}/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newOrder }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reorder job');
      }
      return response.json();
    }, {
      showNotification: false, // Don't show notification for reordering
    });
  }, [makeRequest]);

  const getJob = useCallback(async (jobId) => {
    return makeRequest(async () => {
      const response = await fetch(`/api/jobs/${jobId}`);
      if (!response.ok) throw new Error('Failed to fetch job');
      return response.json();
    });
  }, [makeRequest]);

  return {
    fetchJobs,
    createJob,
    updateJob,
    reorderJob,
    getJob,
  };
};

// Candidates API hook
export const useCandidatesApi = () => {
  const { makeRequest } = useApi();

  const fetchCandidates = useCallback(async (params = {}) => {
    return makeRequest(async () => {
      const queryParams = new URLSearchParams(params).toString();
      const response = await fetch(`/api/candidates?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch candidates');
      return response.json();
    });
  }, [makeRequest]);

  const createCandidate = useCallback(async (candidateData) => {
    return makeRequest(async () => {
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidateData),
      });
      if (!response.ok) throw new Error('Failed to create candidate');
      return response.json();
    }, {
      successMessage: 'Candidate added successfully',
    });
  }, [makeRequest]);

  const updateCandidate = useCallback(async (candidateId, updates) => {
    return makeRequest(async () => {
      const response = await fetch(`/api/candidates/${candidateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update candidate');
      return response.json();
    }, {
      successMessage: 'Candidate updated successfully',
    });
  }, [makeRequest]);

  const getCandidate = useCallback(async (candidateId) => {
    return makeRequest(async () => {
      const response = await fetch(`/api/candidates/${candidateId}`);
      if (!response.ok) throw new Error('Failed to fetch candidate');
      return response.json();
    });
  }, [makeRequest]);

  const getCandidateTimeline = useCallback(async (candidateId) => {
    return makeRequest(async () => {
      const response = await fetch(`/api/candidates/${candidateId}/timeline`);
      if (!response.ok) throw new Error('Failed to fetch candidate timeline');
      return response.json();
    });
  }, [makeRequest]);

  const addCandidateNote = useCallback(async (candidateId, notes) => {
    return makeRequest(async () => {
      const response = await fetch(`/api/candidates/${candidateId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      if (!response.ok) throw new Error('Failed to add note');
      return response.json();
    }, {
      successMessage: 'Note added successfully',
    });
  }, [makeRequest]);

  return {
    fetchCandidates,
    createCandidate,
    updateCandidate,
    getCandidate,
    getCandidateTimeline,
    addCandidateNote,
  };
};

// Assessments API hook
export const useAssessmentsApi = () => {
  const { makeRequest } = useApi();

  const fetchAssessment = useCallback(async (jobId) => {
    return makeRequest(async () => {
      const response = await fetch(`/api/assessments/${jobId}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch assessment');
      }
      return response.json();
    }, {
      showNotification: false, // Don't show notifications for 404s
    });
  }, [makeRequest]);

  const saveAssessment = useCallback(async (jobId, assessmentData) => {
    return makeRequest(async () => {
      const response = await fetch(`/api/assessments/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessmentData),
      });
      if (!response.ok) throw new Error('Failed to save assessment');
      return response.json();
    }, {
      successMessage: 'Assessment saved successfully',
    });
  }, [makeRequest]);

  const submitAssessmentResponse = useCallback(async (jobId, candidateId, responses) => {
    return makeRequest(async () => {
      const response = await fetch(`/api/assessments/${jobId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId, responses }),
      });
      if (!response.ok) throw new Error('Failed to submit assessment');
      return response.json();
    }, {
      successMessage: 'Assessment submitted successfully',
    });
  }, [makeRequest]);

  return {
    fetchAssessment,
    saveAssessment,
    submitAssessmentResponse,
  };
};