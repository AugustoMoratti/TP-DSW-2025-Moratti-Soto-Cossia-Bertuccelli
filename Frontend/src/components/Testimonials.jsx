import React from 'react'


const testimonials = [
{ name: 'María P', text: 'Excelente plataforma — encontré un profesional en minutos.' },
{ name: 'Lucas R', text: 'Proceso seguro y fácil. Muy recomendable.' },
{ name: 'Sofía M', text: 'Buena comunicación y resultados.' },
]


export default function Testimonials() {
return (
<section className="testimonials">
<h2>Testimonios</h2>
<div className="testimonial-grid">
{testimonials.map((t, i) => (
<blockquote key={i}>
<p>“{t.text}”</p>
<footer>— {t.name}</footer>
</blockquote>
))}
</div>
</section>
)
}