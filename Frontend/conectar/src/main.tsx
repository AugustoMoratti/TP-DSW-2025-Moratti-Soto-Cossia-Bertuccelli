import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import Login from './pages/login/login.tsx'
import Registro from './pages/register/register.tsx'
import BusquedaProfesionales from './pages/BusquedaProfesionales/busqProf.tsx'
import NotFound from './pages/error/notFound.tsx'
import Perfil from "./pages/perfil/perfil.tsx";
import InternalServerError from './pages/error/error500.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registro />} />
        <Route path="/busqProfesionales" element={<BusquedaProfesionales />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/*" element={<NotFound />} />
        <Route path="/500" element={<InternalServerError />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
