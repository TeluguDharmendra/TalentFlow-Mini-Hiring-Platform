import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

const ProtectedRoute = ({ children }) => {
  const { state } = useApp();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!state.auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
