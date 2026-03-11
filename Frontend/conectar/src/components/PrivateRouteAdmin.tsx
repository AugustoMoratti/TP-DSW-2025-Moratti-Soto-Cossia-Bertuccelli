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

  if (loading)     
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );

  return admin ? <Outlet /> : <Navigate to="/loginAdmin" replace />;
};

export default PrivateRouteAdmin;