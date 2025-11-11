import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AdminContext } from '../contexts/AdminContext.tsx';
import { fetchMeAdmin } from '../services/auth.services.ts';
import type { Administrador } from '../interfaces/admin.ts';

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Administrador | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAdmin = async () => {
    setLoading(true);
    try {
      const administrador = await fetchMeAdmin();
      setAdmin(administrador);
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refreshAdmin(); }, []);

  return (
    <AdminContext.Provider value={{ admin, loading, refreshAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};