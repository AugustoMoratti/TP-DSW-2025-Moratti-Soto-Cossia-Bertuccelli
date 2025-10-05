import React from 'react'
import { motion } from 'framer-motion'


export default function Hero({ onOpen = () => {} }) {
return (
<section className="hero">
<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
<h1>¿Buscas un profesional confiable?</h1>
<p>Encuentra profesionales verificados, valoraciones reales y contacto directo. Empieza hoy.</p>
<div className="hero-actions">
<button className="btn-primary" onClick={() => onOpen('register')}>Comenzar gratis</button>
<button className="btn-secondary" onClick={() => onOpen('login')}>Hablar con ventas</button>
</div>
</motion.div>
<motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
<div className="hero-image" />
</motion.div>
</section>
)
}