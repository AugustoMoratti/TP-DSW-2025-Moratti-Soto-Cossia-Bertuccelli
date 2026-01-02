import { useState } from 'react';
import type { ReactNode } from 'react';
import { UserContext } from '../contexts/UserContext.tsx';
import { fetchMe } from '../services/auth.services.ts';
import type { Usuario } from '../interfaces/usuario.ts';

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const usuario = await fetchMe();
      setUser(usuario);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};