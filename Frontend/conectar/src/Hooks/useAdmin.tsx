import { useContext } from 'react';
import { AdminContext } from '../contexts/AdminContext';

export const useAdmin = () => useContext(AdminContext);