import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useUser } from '../Hooks/useUser.tsx';

const PrivateRoute = () => {
  const { user, loading, refreshUser } = useUser();

  useEffect(() => {
    if (!user && !loading) {
      refreshUser();
    }
  }, []);

  if (loading) return <div>Cargando...</div>; // opcional mientras verifica

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;