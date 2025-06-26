import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  // --- MOCK AUTHENTICATION ---
  // In a real app, this data would come from a global state (Context API/Redux)
  // after the user logs in.
  const isAuthenticated = true; // Assume user is logged in for now
  const userRole = 'student';   // Mock user role. Change to 'creator' or 'admin' to test.
  // -------------------------

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (userRole !== requiredRole) {
    // Redirect to a 'not authorized' page or back to their own dashboard
    return <div>Not Authorized</div>;
  }

  return children;
};

export default ProtectedRoute;