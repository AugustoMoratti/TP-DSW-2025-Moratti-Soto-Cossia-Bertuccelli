import React, { useState } from 'react';
import './app.css';
import { useNavigate } from "react-router-dom"; // Usando react-router

export default function App() {
  const navigate = useNavigate();
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Bienvenido a Conectar</h1>
        <p>Tu plataforma de conexión social.</p>
        <button onClick={() => navigate("/login")}>Iniciar Sesión</button>
        <button onClick={() => navigate("/registro")}>Registrarse</button>
      </header>
    </div>
  );
}

