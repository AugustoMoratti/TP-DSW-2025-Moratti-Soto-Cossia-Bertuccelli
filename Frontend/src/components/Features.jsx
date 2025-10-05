import React from 'react'
import { Activity, ShieldCheck, Users, Star } from 'lucide-react'


const items = [
{ icon: Activity, title: 'Fácil de usar', text: 'Interfaz intuitiva para publicar y contratar.' },
{ icon: ShieldCheck, title: 'Seguridad', text: 'Verificaciones y pagos seguros.' },
{ icon: Users, title: 'Comunidad', text: 'Miles de profesionales y reseñas reales.' },
{ icon: Star, title: 'Calidad', text: 'Servicio respaldado por valoraciones.' },
]


export default function Features() {
return (
<section className="features">
<h2>¿Por qué elegirnos?</h2>
<div className="feature-grid">
{items.map((it, idx) => (
<div key={idx} className="feature-card">
<it.icon />
<h3>{it.title}</h3>
<p>{it.text}</p>
</div>
))}
</div>
</section>
)
}