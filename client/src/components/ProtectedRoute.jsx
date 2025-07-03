import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth(); // <-- Get the new loading state

  // While the auth status is being checked, show a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // After loading, if there is no user, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // After loading, if a role is required and it doesn't match, redirect
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={`/${user.role}/dashboard`} />;
  }

  return children;
};

export default ProtectedRoute;