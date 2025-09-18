import { createContext, useContext, useReducer, useEffect } from 'react';
import { db, seedDatabase, clearAllData } from '../utils/db.js';

const AppContext = createContext();

// Initial state
const initialState = {
  // Global loading state
  loading: false,
  
  // Error state
  error: null,
  
  // Authentication state
  auth: {
    isAuthenticated: false,
    user: null,
  },
  
  // Jobs state
  jobs: {
    items: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0,
    },
    filters: {
      search: '',
      status: 'all',
    },
    sort: {
      field: 'createdAt',
      order: 'desc',
    },
  },
  
  // Candidates state
  candidates: {
    items: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 50,
      total: 0,
      totalPages: 0,
    },
    filters: {
      search: '',
      stage: 'all',
      jobId: 'all',
    },
    kanbanData: {},
  },
  
  // Assessments state
  assessments: {
    items: [],
    loading: false,
    error: null,
    currentAssessment: null,
    responses: {},
  },
  
  // UI state
  ui: {
    sidebarOpen: true,
    modal: {
      isOpen: false,
      type: null,
      data: null,
    },
    notifications: [],
  },
};

// Action types
export const actionTypes = {
  // Global actions
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Authentication actions
  SET_AUTH: 'SET_AUTH',
  LOGOUT: 'LOGOUT',
  
  // Jobs actions
  SET_JOBS_LOADING: 'SET_JOBS_LOADING',
  SET_JOBS_ERROR: 'SET_JOBS_ERROR',
  SET_JOBS: 'SET_JOBS',
  ADD_JOB: 'ADD_JOB',
  UPDATE_JOB: 'UPDATE_JOB',
  DELETE_JOB: 'DELETE_JOB',
  SET_JOBS_FILTERS: 'SET_JOBS_FILTERS',
  SET_JOBS_SORT: 'SET_JOBS_SORT',
  SET_JOBS_PAGINATION: 'SET_JOBS_PAGINATION',
  REORDER_JOBS: 'REORDER_JOBS',
  
  // Candidates actions
  SET_CANDIDATES_LOADING: 'SET_CANDIDATES_LOADING',
  SET_CANDIDATES_ERROR: 'SET_CANDIDATES_ERROR',
  SET_CANDIDATES: 'SET_CANDIDATES',
  ADD_CANDIDATE: 'ADD_CANDIDATE',
  UPDATE_CANDIDATE: 'UPDATE_CANDIDATE',
  DELETE_CANDIDATE: 'DELETE_CANDIDATE',
  SET_CANDIDATES_FILTERS: 'SET_CANDIDATES_FILTERS',
  SET_CANDIDATES_PAGINATION: 'SET_CANDIDATES_PAGINATION',
  SET_KANBAN_DATA: 'SET_KANBAN_DATA',
  MOVE_CANDIDATE: 'MOVE_CANDIDATE',
  
  // Assessments actions
  SET_ASSESSMENTS_LOADING: 'SET_ASSESSMENTS_LOADING',
  SET_ASSESSMENTS_ERROR: 'SET_ASSESSMENTS_ERROR',
  SET_ASSESSMENTS: 'SET_ASSESSMENTS',
  SET_CURRENT_ASSESSMENT: 'SET_CURRENT_ASSESSMENT',
  UPDATE_ASSESSMENT: 'UPDATE_ASSESSMENT',
  SET_ASSESSMENT_RESPONSES: 'SET_ASSESSMENT_RESPONSES',
  
  // UI actions
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  OPEN_MODAL: 'OPEN_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
      
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload };
      
    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null };
      
    // Authentication reducers
    case actionTypes.SET_AUTH:
      return {
        ...state,
        auth: action.payload,
      };
      
    case actionTypes.LOGOUT:
      return {
        ...state,
        auth: {
          isAuthenticated: false,
          user: null,
        },
      };
      
    // Jobs reducers
    case actionTypes.SET_JOBS_LOADING:
      return {
        ...state,
        jobs: { ...state.jobs, loading: action.payload },
      };
      
    case actionTypes.SET_JOBS_ERROR:
      return {
        ...state,
        jobs: { ...state.jobs, error: action.payload, loading: false },
      };
      
    case actionTypes.SET_JOBS:
      return {
        ...state,
        jobs: {
          ...state.jobs,
          items: action.payload.data || [],
          pagination: {
            page: action.payload.page || 1,
            pageSize: action.payload.pageSize || 10,
            total: action.payload.total || 0,
            totalPages: action.payload.totalPages || 0,
          },
          loading: false,
          error: null,
        },
      };
      
    case actionTypes.ADD_JOB:
      return {
        ...state,
        jobs: {
          ...state.jobs,
          items: [action.payload, ...state.jobs.items],
        },
      };
      
    case actionTypes.UPDATE_JOB:
      return {
        ...state,
        jobs: {
          ...state.jobs,
          items: state.jobs.items.map(job =>
            job.id === action.payload.id ? action.payload : job
          ),
        },
      };
      
    case actionTypes.DELETE_JOB:
      return {
        ...state,
        jobs: {
          ...state.jobs,
          items: state.jobs.items.filter(job => job.id !== action.payload),
        },
      };
      
    case actionTypes.SET_JOBS_FILTERS:
      return {
        ...state,
        jobs: {
          ...state.jobs,
          filters: { ...state.jobs.filters, ...action.payload },
          pagination: { ...state.jobs.pagination, page: 1 },
        },
      };
      
    case actionTypes.SET_JOBS_SORT:
      return {
        ...state,
        jobs: {
          ...state.jobs,
          sort: action.payload,
          pagination: { ...state.jobs.pagination, page: 1 },
        },
      };
      
    case actionTypes.SET_JOBS_PAGINATION:
      return {
        ...state,
        jobs: {
          ...state.jobs,
          pagination: { ...state.jobs.pagination, ...action.payload },
        },
      };
      
    case actionTypes.REORDER_JOBS:
      return {
        ...state,
        jobs: {
          ...state.jobs,
          items: action.payload,
        },
      };
      
    // Candidates reducers
    case actionTypes.SET_CANDIDATES_LOADING:
      return {
        ...state,
        candidates: { ...state.candidates, loading: action.payload },
      };
      
    case actionTypes.SET_CANDIDATES_ERROR:
      return {
        ...state,
        candidates: { ...state.candidates, error: action.payload, loading: false },
      };
      
    case actionTypes.SET_CANDIDATES:
      return {
        ...state,
        candidates: {
          ...state.candidates,
          items: action.payload.data || [],
          pagination: {
            page: action.payload.page || 1,
            pageSize: action.payload.pageSize || 50,
            total: action.payload.total || 0,
            totalPages: action.payload.totalPages || 0,
          },
          loading: false,
          error: null,
        },
      };
      
    case actionTypes.ADD_CANDIDATE:
      return {
        ...state,
        candidates: {
          ...state.candidates,
          items: [action.payload, ...state.candidates.items],
        },
      };
      
    case actionTypes.UPDATE_CANDIDATE:
      return {
        ...state,
        candidates: {
          ...state.candidates,
          items: state.candidates.items.map(candidate =>
            candidate.id === action.payload.id ? action.payload : candidate
          ),
        },
      };
      
    case actionTypes.DELETE_CANDIDATE:
      return {
        ...state,
        candidates: {
          ...state.candidates,
          items: state.candidates.items.filter(candidate => candidate.id !== action.payload),
        },
      };
      
    case actionTypes.SET_CANDIDATES_FILTERS:
      return {
        ...state,
        candidates: {
          ...state.candidates,
          filters: { ...state.candidates.filters, ...action.payload },
          pagination: { ...state.candidates.pagination, page: 1 },
        },
      };
      
    case actionTypes.SET_CANDIDATES_PAGINATION:
      return {
        ...state,
        candidates: {
          ...state.candidates,
          pagination: { ...state.candidates.pagination, ...action.payload },
        },
      };
      
    case actionTypes.SET_KANBAN_DATA:
      return {
        ...state,
        candidates: {
          ...state.candidates,
          kanbanData: action.payload,
        },
      };
      
    case actionTypes.MOVE_CANDIDATE:
      const { candidateId, newStage } = action.payload;
      return {
        ...state,
        candidates: {
          ...state.candidates,
          items: state.candidates.items.map(candidate =>
            candidate.id === candidateId 
              ? { ...candidate, stage: newStage, updatedAt: new Date() }
              : candidate
          ),
        },
      };
      
    // Assessments reducers
    case actionTypes.SET_ASSESSMENTS_LOADING:
      return {
        ...state,
        assessments: { ...state.assessments, loading: action.payload },
      };
      
    case actionTypes.SET_ASSESSMENTS_ERROR:
      return {
        ...state,
        assessments: { ...state.assessments, error: action.payload, loading: false },
      };
      
    case actionTypes.SET_ASSESSMENTS:
      return {
        ...state,
        assessments: {
          ...state.assessments,
          items: action.payload,
          loading: false,
          error: null,
        },
      };
      
    case actionTypes.SET_CURRENT_ASSESSMENT:
      return {
        ...state,
        assessments: {
          ...state.assessments,
          currentAssessment: action.payload,
        },
      };
      
    case actionTypes.UPDATE_ASSESSMENT:
      return {
        ...state,
        assessments: {
          ...state.assessments,
          currentAssessment: action.payload,
          items: state.assessments.items.map(assessment =>
            assessment.jobId === action.payload.jobId ? action.payload : assessment
          ),
        },
      };
      
    case actionTypes.SET_ASSESSMENT_RESPONSES:
      return {
        ...state,
        assessments: {
          ...state.assessments,
          responses: { ...state.assessments.responses, ...action.payload },
        },
      };
      
    // UI reducers
    case actionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarOpen: !state.ui.sidebarOpen,
        },
      };
      
    case actionTypes.OPEN_MODAL:
      return {
        ...state,
        ui: {
          ...state.ui,
          modal: {
            isOpen: true,
            type: action.payload.type,
            data: action.payload.data,
          },
        },
      };
      
    case actionTypes.CLOSE_MODAL:
      return {
        ...state,
        ui: {
          ...state.ui,
          modal: {
            isOpen: false,
            type: null,
            data: null,
          },
        },
      };
      
    case actionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: [...state.ui.notifications, action.payload],
        },
      };
      
    case actionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter(
            notification => notification.id !== action.payload
          ),
        },
      };
      
    default:
      return state;
  }
};

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize database and auth on app start
  useEffect(() => {
    const initializeApp = async () => {
      try {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        
        // Check for existing auth state
        const savedAuth = localStorage.getItem('talentflow_auth');
        if (savedAuth) {
          const authData = JSON.parse(savedAuth);
          dispatch({ type: actionTypes.SET_AUTH, payload: authData });
        }
        
        // Clear database to update names to Indian names
        const needsClear = localStorage.getItem('talentflow_indian_names') !== 'true';
        if (needsClear) {
          await clearAllData();
          localStorage.setItem('talentflow_indian_names', 'true');
        }
        
        await seedDatabase();
        
        // Add a small delay to ensure database is fully ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      } catch (error) {
        console.error('Failed to initialize app:', error);
        dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      }
    };

    initializeApp();
  }, []);

  // Persist auth state to localStorage
  useEffect(() => {
    if (state.auth.isAuthenticated) {
      localStorage.setItem('talentflow_auth', JSON.stringify(state.auth));
    } else {
      localStorage.removeItem('talentflow_auth');
    }
  }, [state.auth]);

  // Action creators
  const actions = {
    // Global actions
    setLoading: (loading) => dispatch({ type: actionTypes.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: actionTypes.SET_ERROR, payload: error }),
    clearError: () => dispatch({ type: actionTypes.CLEAR_ERROR }),
    
    // Authentication actions
    setAuth: (auth) => dispatch({ type: actionTypes.SET_AUTH, payload: auth }),
    logout: () => dispatch({ type: actionTypes.LOGOUT }),
    
    // Jobs actions
    setJobsLoading: (loading) => dispatch({ type: actionTypes.SET_JOBS_LOADING, payload: loading }),
    setJobsError: (error) => dispatch({ type: actionTypes.SET_JOBS_ERROR, payload: error }),
    setJobs: (jobs) => dispatch({ type: actionTypes.SET_JOBS, payload: jobs }),
    addJob: (job) => dispatch({ type: actionTypes.ADD_JOB, payload: job }),
    updateJob: (job) => dispatch({ type: actionTypes.UPDATE_JOB, payload: job }),
    deleteJob: (jobId) => dispatch({ type: actionTypes.DELETE_JOB, payload: jobId }),
    setJobsFilters: (filters) => dispatch({ type: actionTypes.SET_JOBS_FILTERS, payload: filters }),
    setJobsSort: (sort) => dispatch({ type: actionTypes.SET_JOBS_SORT, payload: sort }),
    setJobsPagination: (pagination) => dispatch({ type: actionTypes.SET_JOBS_PAGINATION, payload: pagination }),
    reorderJobs: (jobs) => dispatch({ type: actionTypes.REORDER_JOBS, payload: jobs }),
    
    // Candidates actions
    setCandidatesLoading: (loading) => dispatch({ type: actionTypes.SET_CANDIDATES_LOADING, payload: loading }),
    setCandidatesError: (error) => dispatch({ type: actionTypes.SET_CANDIDATES_ERROR, payload: error }),
    setCandidates: (candidates) => dispatch({ type: actionTypes.SET_CANDIDATES, payload: candidates }),
    addCandidate: (candidate) => dispatch({ type: actionTypes.ADD_CANDIDATE, payload: candidate }),
    updateCandidate: (candidate) => dispatch({ type: actionTypes.UPDATE_CANDIDATE, payload: candidate }),
    deleteCandidate: (candidateId) => dispatch({ type: actionTypes.DELETE_CANDIDATE, payload: candidateId }),
    setCandidatesFilters: (filters) => dispatch({ type: actionTypes.SET_CANDIDATES_FILTERS, payload: filters }),
    setCandidatesPagination: (pagination) => dispatch({ type: actionTypes.SET_CANDIDATES_PAGINATION, payload: pagination }),
    setKanbanData: (data) => dispatch({ type: actionTypes.SET_KANBAN_DATA, payload: data }),
    moveCandidate: (candidateId, newStage) => dispatch({ type: actionTypes.MOVE_CANDIDATE, payload: { candidateId, newStage } }),
    
    // Assessments actions
    setAssessmentsLoading: (loading) => dispatch({ type: actionTypes.SET_ASSESSMENTS_LOADING, payload: loading }),
    setAssessmentsError: (error) => dispatch({ type: actionTypes.SET_ASSESSMENTS_ERROR, payload: error }),
    setAssessments: (assessments) => dispatch({ type: actionTypes.SET_ASSESSMENTS, payload: assessments }),
    setCurrentAssessment: (assessment) => dispatch({ type: actionTypes.SET_CURRENT_ASSESSMENT, payload: assessment }),
    updateAssessment: (assessment) => dispatch({ type: actionTypes.UPDATE_ASSESSMENT, payload: assessment }),
    setAssessmentResponses: (responses) => dispatch({ type: actionTypes.SET_ASSESSMENT_RESPONSES, payload: responses }),
    
    // UI actions
    toggleSidebar: () => dispatch({ type: actionTypes.TOGGLE_SIDEBAR }),
    openModal: (type, data) => dispatch({ type: actionTypes.OPEN_MODAL, payload: { type, data } }),
    closeModal: () => dispatch({ type: actionTypes.CLOSE_MODAL }),
    addNotification: (notification) => dispatch({ type: actionTypes.ADD_NOTIFICATION, payload: { ...notification, id: Date.now() } }),
    removeNotification: (id) => dispatch({ type: actionTypes.REMOVE_NOTIFICATION, payload: id }),
  };

  const value = {
    state,
    actions,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;