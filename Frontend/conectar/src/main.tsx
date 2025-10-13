import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import Login from './pages/login.tsx'
import Registro from './pages/register.tsx'
import BusquedaProfesionales from './pages/BusquedaProfesionales/busqProf.tsx'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registro />} />
        <Route path="/busqProfesionales" element={<BusquedaProfesionales />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

//<Route path="/registro" element={<Registro />} />