import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useAdmin } from '../Hooks/useAdmin.tsx';

const PrivateRouteAdmin = () => {
  const { admin, loading, refreshAdmin } = useAdmin();

  useEffect(() => {
    if (!admin && !loading) {
      refreshAdmin();
    }
  }, []);

  if (loading) return <div>Cargando...</div>; // opcional mientras verifica

  return admin ? <Outlet /> : <Navigate to="/loginAdmin" replace />;
};

export default PrivateRouteAdmin;