import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import Login from './pages/login/login.tsx'
import Registro from './pages/register/register.tsx'
import BusquedaProfesionales from './pages/BusquedaProfesionales/busqProf.tsx'
import NotFound from './pages/error/notFound.tsx'
import Perfil from './pages/MiPerfil/perfil.tsx';
import SuPerfil from './pages/SuPefil/SuPerfil.tsx'
import InternalServerError from './pages/error/error500.tsx';
import Dashboard from './pages/Dashboard/dashboard.tsx'
import Terminos from './pages/terminos/terminos.tsx';
import RequireAuth from "./components/RequireAuth";
import About from './pages/about/about.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registro />} />
        <Route
          path="/perfil/:id"
          element={
            <RequireAuth>
              <Perfil />
            </RequireAuth>
          }
        />
        <Route path="/SuPerfil" element={<SuPerfil />} />
        <Route path="/busqProfesionales" element={<BusquedaProfesionales />} />
        <Route path="/*" element={<NotFound />} />
        <Route path="/500" element={<InternalServerError />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
