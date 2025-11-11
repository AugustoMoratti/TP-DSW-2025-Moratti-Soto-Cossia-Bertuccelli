import { Navigate, Outlet } from 'react-router-dom';
import { useAdmin } from '../Hooks/useAdmin.tsx';

const PrivateRouteAdmin = () => {
  const { admin, loading } = useAdmin();

  if (loading) return <div>Cargando...</div>; // opcional mientras verifica

  return admin ? <Outlet /> : <Navigate to="/loginAdmin" replace />;
};

export default PrivateRouteAdmin;