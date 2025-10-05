import React from 'react'


export default function Header({ onOpen = () => {} }) {
return (
<header className="header">
<div className="logo">LOGO</div>
<nav className="nav">
<a>Home</a>
<a>About</a>
<a>Resources</a>
<a>Contact</a>
</nav>
<div className="actions">
<button className="btn-secondary" onClick={() => onOpen('login')}>Iniciar sesión</button>
<button className="btn-primary" onClick={() => onOpen('register')}>Registrarse</button>
</div>
</header>
)
}