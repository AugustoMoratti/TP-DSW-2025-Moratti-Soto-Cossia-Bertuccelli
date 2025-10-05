import React from 'react'
import { Facebook, Twitter, Instagram } from 'lucide-react'


export default function Footer() {
return (
<footer className="footer">
<div className="footer-grid">
<div>
<div className="logo">CONETAR</div>
<p>Conectamos a profesionales con clientes de confianza.</p>
</div>
<div className="links">
<a>Contacto</a>
<a>Política de privacidad</a>
<a>Términos</a>
</div>
<div className="social">
<Facebook />
<Twitter />
<Instagram />
</div>
</div>
<div className="copy">© {new Date().getFullYear()} ConetAR - Todos los derechos reservados</div>
</footer>
)
}