// Job types
export const JOB_STATUS = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
};

// Candidate stages
export const CANDIDATE_STAGES = {
  APPLIED: 'applied',
  SCREENING: 'screening',
  INTERVIEW: 'interview',
  OFFER: 'offer',
  HIRED: 'hired',
  REJECTED: 'rejected',
};

// Question types for assessments
export const QUESTION_TYPES = {
  SINGLE_CHOICE: 'single_choice',
  MULTI_CHOICE: 'multi_choice',
  SHORT_TEXT: 'short_text',
  LONG_TEXT: 'long_text',
  NUMERIC_RANGE: 'numeric_range',
  FILE_UPLOAD: 'file_upload',
};

// API endpoints
export const API_ENDPOINTS = {
  JOBS: '/api/jobs',
  CANDIDATES: '/api/candidates',
  ASSESSMENTS: '/api/assessments',
};