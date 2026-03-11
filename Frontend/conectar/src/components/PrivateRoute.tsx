import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../Hooks/useUser.tsx';

const PrivateRoute = () => {
  const { user, loading } = useUser();


  if (loading)     
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    ); // opcional mientras verifica

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;