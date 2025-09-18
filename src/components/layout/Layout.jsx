import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import { NotificationContainer } from '../common/Notification.jsx';
import { useApp } from '../../contexts/AppContext.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

const Layout = () => {
  const { state, actions } = useApp();

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 lg:ml-0 flex flex-col min-w-0">
        {/* Main content */}
        <div className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
          {state.loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <LoadingSpinner size="xl" />
                <p className="mt-4 text-gray-500">Loading application...</p>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </main>

      {/* Global notifications */}
      <NotificationContainer
        notifications={state.ui.notifications}
        onClose={actions.removeNotification}
      />

      {/* Global error display */}
      {state.error && (
        <div className="fixed bottom-4 left-4 right-4 lg:left-72 lg:right-4 z-40">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">
                  Application Error
                </h3>
                <div className="mt-1 text-sm text-red-700">
                  {state.error}
                </div>
                <div className="mt-3">
                  <button
                    onClick={actions.clearError}
                    className="text-sm font-medium text-red-800 hover:text-red-900"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;