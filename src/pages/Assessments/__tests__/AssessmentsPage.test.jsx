import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AssessmentsPage from '../AssessmentsPage';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('AssessmentsPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders assessments list with Start buttons', () => {
    renderWithRouter(<AssessmentsPage />);

    expect(screen.getByText('Assessments')).toBeInTheDocument();
    expect(screen.getByText('JavaScript Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('React Development')).toBeInTheDocument();
    expect(screen.getByText('Data Structures & Algorithms')).toBeInTheDocument();
    
    // Check for Start buttons
    const startButtons = screen.getAllByText('Start');
    expect(startButtons).toHaveLength(3);
  });

  test('shows Create New Assessment button for admin', () => {
    renderWithRouter(<AssessmentsPage />);

    expect(screen.getByText('Create New Assessment')).toBeInTheDocument();
  });

  test('shows Edit buttons for admin', () => {
    renderWithRouter(<AssessmentsPage />);

    // Check for Edit buttons (they should be present for admin)
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    expect(editButtons.length).toBeGreaterThan(0);
  });

  test('opens create assessment modal when Create button is clicked', () => {
    renderWithRouter(<AssessmentsPage />);

    fireEvent.click(screen.getByText('Create New Assessment'));

    expect(screen.getByText('Create New Assessment')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Duration')).toBeInTheDocument();
    expect(screen.getByLabelText('Difficulty')).toBeInTheDocument();
  });

  test('opens edit assessment modal when Edit button is clicked', () => {
    renderWithRouter(<AssessmentsPage />);

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    expect(screen.getByText('Edit Assessment')).toBeInTheDocument();
    expect(screen.getByDisplayValue('JavaScript Fundamentals')).toBeInTheDocument();
  });

  test('can add new questions in create modal', () => {
    renderWithRouter(<AssessmentsPage />);

    fireEvent.click(screen.getByText('Create New Assessment'));
    fireEvent.click(screen.getByText('Add Question'));

    expect(screen.getByText('Question 1')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter question')).toBeInTheDocument();
  });

  test('can cancel modal operations', () => {
    renderWithRouter(<AssessmentsPage />);

    fireEvent.click(screen.getByText('Create New Assessment'));
    fireEvent.click(screen.getByText('Cancel'));

    expect(screen.queryByText('Create New Assessment')).not.toBeInTheDocument();
  });

  test('navigates to assessment when Start button is clicked', () => {
    renderWithRouter(<AssessmentsPage />);

    const startButtons = screen.getAllByText('Start');
    fireEvent.click(startButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/assessment/1');
  });
});


