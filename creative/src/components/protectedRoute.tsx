import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './authContext';


const ProtectedRoute = () => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }

  return <Outlet />; // Render the child routes if authenticated
};

export default ProtectedRoute;
