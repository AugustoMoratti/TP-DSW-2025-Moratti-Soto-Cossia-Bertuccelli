import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import Login from './pages/login/login.tsx'
import Registro from './pages/register/register.tsx'
import BusquedaProfesionales from './pages/BusquedaProfesionales/busqProf.tsx'
import NotFound from './pages/error/notFound.tsx'
import Perfil from './pages/MiPerfil/perfil.tsx';
import SuPerfil from './pages/SuPefil/SuPerfil.tsx'
import EditProfile from './pages/modificarPerfil/modPerf.tsx'
import InternalServerError from './pages/error/error500.tsx';
import Dashboard from './pages/Dashboard/dashboard.tsx'
import Terminos from './pages/terminos/terminos.tsx';
import Contacto from './pages/contacto/contacto.tsx';
import TrabajosContratados from './pages/trabajo/trabajoContratados.tsx'
import TrabajosPropios from './pages/trabajo/trabajoPropios.tsx'
import LoginAdmin from './pages/loginAdmin/loginAdmin.tsx'

import { UserProvider } from './providers/UserProvider.tsx'
import PrivateRoute from './components/PrivateRoute';

import { AdminProvider } from './providers/AdminProvider.tsx'
import PrivateRouteAdmin from './components/PrivateRouteAdmin.tsx'

/*
<Route element={<PrivateRoute />}>   
    <Route path="/perfil" element={<Perfil />} />
    <Route path="/SuPerfil/:id" element={<SuPerfil />} />
    <Route path="/busqProfesionales" element={<BusquedaProfesionales />} />
    <Route path="/*" element={<NotFound />} />
    <Route path="/500" element={<InternalServerError />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/terminos" element={<Terminos />} />
    <Route path="/contact" element={<Contacto />} />
  </Route>
  
*/

createRoot(document.getElementById('root')!).render(
  <UserProvider>
    <AdminProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registro />} />

          <Route path="/loginAdmin" element={<LoginAdmin />} />


          <Route path="/*" element={<NotFound />} />
          <Route path="/500" element={<InternalServerError />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/contact" element={<Contacto />} />

          <Route element={<PrivateRoute />}>
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/trabajosContratados" element={<TrabajosContratados />} />
            <Route path="/trabajosPropios" element={<TrabajosPropios />} />
            <Route path="/SuPerfil/:id" element={<SuPerfil />} />
            <Route path="/ModPerfil/:id" element={<EditProfile />} />
            <Route path="/busqProfesionales" element={<BusquedaProfesionales />} />
          </Route>

          <Route element={<PrivateRouteAdmin />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AdminProvider>
  </UserProvider>
);
