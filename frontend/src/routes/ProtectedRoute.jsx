import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  const normalizedRole = user?.role?.toLowerCase().trim();
  const normalizedAllowed = allowedRoles?.map(r => r.toLowerCase().trim()) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Double check role exists on user object
  if (!user || !user.role) {
    return <Navigate to="/" replace />;
  }

  const userRole = user.role.toLowerCase().trim();
  const isAllowed = allowedRoles.some(role => role.toLowerCase().trim() === userRole);

  if (!isAllowed) {
    // If not allowed, redirect to their own dashboard or root
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
