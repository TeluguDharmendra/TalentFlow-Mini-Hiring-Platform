import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import DashboardPage from '../DashboardPage';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper function to render component with router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('DashboardPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe('Navigation', () => {
    test('should render dashboard with navigation tabs', () => {
      renderWithRouter(<DashboardPage />);
      
      expect(screen.getByText('TalentFlow Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Assessments')).toBeInTheDocument();
      expect(screen.getByText('Jobs')).toBeInTheDocument();
      expect(screen.getByText('Candidates')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    test('should switch between tabs when clicked', () => {
      renderWithRouter(<DashboardPage />);
      
      // Initially should show Assessments
      expect(screen.getByText('Assessments')).toBeInTheDocument();
      
      // Click Jobs tab
      fireEvent.click(screen.getByText('Jobs'));
      expect(screen.getByText('Job Postings (30)')).toBeInTheDocument();
      
      // Click Candidates tab
      fireEvent.click(screen.getByText('Candidates'));
      expect(screen.getByText('Candidates (1000)')).toBeInTheDocument();
      
      // Click Settings tab
      fireEvent.click(screen.getByText('Settings'));
      expect(screen.getByText('Settings Coming Soon')).toBeInTheDocument();
    });

    test('should have logout functionality', () => {
      renderWithRouter(<DashboardPage />);
      
      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Assessments Section', () => {
    test('should display all 5 demo assessments', () => {
      renderWithRouter(<DashboardPage />);
      
      expect(screen.getByText('JavaScript Basics Quiz')).toBeInTheDocument();
      expect(screen.getByText('React Coding Challenge')).toBeInTheDocument();
      expect(screen.getByText('Data Structures MCQ')).toBeInTheDocument();
      expect(screen.getByText('System Design Case Study')).toBeInTheDocument();
      expect(screen.getByText('Aptitude & Logical Reasoning Test')).toBeInTheDocument();
    });

    test('should show correct question counts for assessments', () => {
      renderWithRouter(<DashboardPage />);
      
      expect(screen.getByText('20 questions')).toBeInTheDocument();
      expect(screen.getByText('10 questions')).toBeInTheDocument();
      expect(screen.getByText('25 questions')).toBeInTheDocument();
      expect(screen.getByText('1 questions')).toBeInTheDocument();
      expect(screen.getByText('30 questions')).toBeInTheDocument();
    });

    test('should have Start Assessment buttons', () => {
      renderWithRouter(<DashboardPage />);
      
      const startButtons = screen.getAllByText('Start Assessment');
      expect(startButtons).toHaveLength(5);
    });
  });

  describe('Jobs Section', () => {
    test('should display jobs tab with correct count', () => {
      renderWithRouter(<DashboardPage />);
      
      fireEvent.click(screen.getByText('Jobs'));
      expect(screen.getByText('Job Postings (30)')).toBeInTheDocument();
    });

    test('should show all 30 job titles', () => {
      renderWithRouter(<DashboardPage />);
      
      fireEvent.click(screen.getByText('Jobs'));
      
      const expectedJobs = [
        'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Engineer',
        'Data Scientist', 'DevOps Engineer', 'Product Manager', 'QA Engineer',
        'Mobile App Developer', 'UI/UX Designer', 'Machine Learning Engineer', 'Cloud Architect',
        'Security Engineer', 'Database Administrator', 'Technical Writer', 'Scrum Master',
        'Business Analyst', 'Sales Engineer', 'Marketing Manager', 'HR Specialist',
        'Financial Analyst', 'Operations Manager', 'Customer Success Manager', 'Content Creator',
        'Graphic Designer', 'Network Engineer', 'System Administrator', 'Research Scientist',
        'Consultant', 'Project Manager'
      ];
      
      expectedJobs.forEach(job => {
        expect(screen.getByText(job)).toBeInTheDocument();
      });
    });

    test('should have View Details buttons for all jobs', () => {
      renderWithRouter(<DashboardPage />);
      
      fireEvent.click(screen.getByText('Jobs'));
      
      const viewDetailsButtons = screen.getAllByText('View Details');
      expect(viewDetailsButtons).toHaveLength(30);
    });
  });

  describe('Candidates Section', () => {
    test('should display candidates tab with correct count', () => {
      renderWithRouter(<DashboardPage />);
      
      fireEvent.click(screen.getByText('Candidates'));
      expect(screen.getByText('Candidates (1000)')).toBeInTheDocument();
    });

    test('should show candidates table with proper headers', () => {
      renderWithRouter(<DashboardPage />);
      
      fireEvent.click(screen.getByText('Candidates'));
      
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    test('should display first 50 candidates in table', () => {
      renderWithRouter(<DashboardPage />);
      
      fireEvent.click(screen.getByText('Candidates'));
      
      // Check that we have candidate data
      expect(screen.getByText('Candidate 1')).toBeInTheDocument();
      expect(screen.getByText('candidate1@example.com')).toBeInTheDocument();
      
      // Check status badges
      const statusElements = screen.getAllByText(/Applied|In Review|Selected|Rejected/);
      expect(statusElements.length).toBeGreaterThan(0);
    });

    test('should show pagination info', () => {
      renderWithRouter(<DashboardPage />);
      
      fireEvent.click(screen.getByText('Candidates'));
      
      expect(screen.getByText('Showing 50 of 1000 candidates')).toBeInTheDocument();
    });
  });

  describe('Settings Section', () => {
    test('should display settings placeholder', () => {
      renderWithRouter(<DashboardPage />);
      
      fireEvent.click(screen.getByText('Settings'));
      
      expect(screen.getByText('Settings Coming Soon')).toBeInTheDocument();
      expect(screen.getByText('Settings will be available soon.')).toBeInTheDocument();
    });
  });

  describe('Styling and Colors', () => {
    test('should have proper tab colors', () => {
      renderWithRouter(<DashboardPage />);
      
      const assessmentsTab = screen.getByText('Assessments').closest('button');
      const jobsTab = screen.getByText('Jobs').closest('button');
      const candidatesTab = screen.getByText('Candidates').closest('button');
      const settingsTab = screen.getByText('Settings').closest('button');
      
      // Check that tabs have proper color classes when active
      fireEvent.click(screen.getByText('Assessments'));
      expect(assessmentsTab).toHaveClass('bg-blue-500');
      
      fireEvent.click(screen.getByText('Jobs'));
      expect(jobsTab).toHaveClass('bg-green-500');
      
      fireEvent.click(screen.getByText('Candidates'));
      expect(candidatesTab).toHaveClass('bg-purple-500');
      
      fireEvent.click(screen.getByText('Settings'));
      expect(settingsTab).toHaveClass('bg-orange-500');
    });
  });

  describe('Responsive Design', () => {
    test('should have proper responsive classes', () => {
      renderWithRouter(<DashboardPage />);
      
      // Check for responsive grid classes
      const assessmentsGrid = screen.getByText('Assessments').closest('div')?.parentElement;
      expect(assessmentsGrid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
    });
  });

  describe('Data Generation', () => {
    test('should generate unique candidate names', () => {
      renderWithRouter(<DashboardPage />);
      
      fireEvent.click(screen.getByText('Candidates'));
      
      // Check that we have different candidate names
      expect(screen.getByText('Candidate 1')).toBeInTheDocument();
      expect(screen.getByText('Candidate 2')).toBeInTheDocument();
    });

    test('should have proper email format for candidates', () => {
      renderWithRouter(<DashboardPage />);
      
      fireEvent.click(screen.getByText('Candidates'));
      
      expect(screen.getByText('candidate1@example.com')).toBeInTheDocument();
      expect(screen.getByText('candidate2@example.com')).toBeInTheDocument();
    });
  });
});

