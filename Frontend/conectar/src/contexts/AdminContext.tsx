import { createContext } from 'react';
import type { Administrador } from '../interfaces/admin.ts';

interface AdminContextType {
  admin: Administrador | null;
  loading: boolean;
  refreshAdmin: () => void;
}

export const AdminContext = createContext<AdminContextType>({
  admin: null,
  loading: true,
  refreshAdmin: () => { },
});