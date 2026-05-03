import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // 🔄 Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 🔒 Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 🚫 Role not allowed → Show professional 403 Access Denied UI
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">403 - Access Denied</h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
          You do not have permission to access this resource. Please contact your College SuperAdmin or Department Admin if you believe this is an error.
        </p>
        <button
          onClick={() => window.history.back()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition shadow-sm hover:shadow"
        >
          Go Back
        </button>
      </div>
    );
  }

  return children;
};

export default RoleRoute;