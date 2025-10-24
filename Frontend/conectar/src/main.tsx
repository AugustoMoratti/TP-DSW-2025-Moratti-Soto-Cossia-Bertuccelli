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
import Contacto from './pages/contacto/contacto.tsx';
import Chat from './pages/chat/chat.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registro />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/SuPerfil/:id" element={<SuPerfil />} />
        <Route path="/busqProfesionales" element={<BusquedaProfesionales />} />
        <Route path="/*" element={<NotFound />} />
        <Route path="/500" element={<InternalServerError />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/contact" element={<Contacto />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
