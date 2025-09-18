import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import WelcomePage from '../WelcomePage';

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

describe('WelcomePage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe('Get Started Button', () => {
    test('should trigger login flow when clicked', () => {
      renderWithRouter(<WelcomePage />);
      
      const getStartedButton = screen.getByText('Get Started');
      
      fireEvent.click(getStartedButton);
      
      // Should navigate to dashboard
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('Landing Page Content', () => {
    test('should display main heading and description', () => {
      renderWithRouter(<WelcomePage />);
      
      expect(screen.getByText('Hire Smarter.')).toBeInTheDocument();
      expect(screen.getByText('Grow Faster.')).toBeInTheDocument();
      expect(screen.getByText('TalentFlow helps you manage hiring, assessments, and candidates seamlessly.')).toBeInTheDocument();
    });

    test('should display About TalentFlow Hiring Process section', () => {
      renderWithRouter(<WelcomePage />);
      
      expect(screen.getByText('About TalentFlow Hiring Process')).toBeInTheDocument();
      expect(screen.getByText('Apply')).toBeInTheDocument();
      expect(screen.getByText('Assessment')).toBeInTheDocument();
      expect(screen.getByText('Interview')).toBeInTheDocument();
      expect(screen.getByText('Offer')).toBeInTheDocument();
    });

    test('should display hiring process steps with descriptions', () => {
      renderWithRouter(<WelcomePage />);
      
      expect(screen.getByText(/Candidates submit their applications/)).toBeInTheDocument();
      expect(screen.getByText(/Comprehensive skill assessments/)).toBeInTheDocument();
      expect(screen.getByText(/Structured interviews/)).toBeInTheDocument();
      expect(screen.getByText(/Extend offers to the best candidates/)).toBeInTheDocument();
    });
  });
});
