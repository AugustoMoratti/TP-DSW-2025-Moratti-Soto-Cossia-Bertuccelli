import { createContext } from 'react';
import type { Usuario } from '../interfaces/usuario.ts';

interface UserContextType {
  user: Usuario | null;
  loading: boolean;
  refreshUser: () => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refreshUser: () => { },
});
