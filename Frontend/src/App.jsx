import React, { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'
import { AnimatePresence, motion } from 'framer-motion'
import AuthForm from './components/AuthForm'


export default function App() {
const [openModal, setOpenModal] = useState(null)


return (
<div className="app">
<Header onOpen={(type) => setOpenModal(type)} />


<main className="main">
<AnimatePresence mode="wait">
<motion.div
key="page"
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -8 }}
transition={{ duration: 0.5 }}
>
<Hero onOpen={(t) => setOpenModal(t)} />
<Features />
<Testimonials />
</motion.div>
</AnimatePresence>
</main>


<Footer />


<AnimatePresence>
{openModal && (
<motion.div
className="modal-overlay"
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
>
<motion.div
initial={{ scale: 0.95, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
exit={{ scale: 0.95, opacity: 0 }}
transition={{ duration: 0.18 }}
className="modal"
>
{openModal === 'register' ? (
<div>
<h3>Crear cuenta</h3>
<AuthForm type="register" onClose={() => setOpenModal(null)} />
</div>
) : (
<div>
<h3>Iniciar sesión</h3>
<AuthForm type="login" onClose={() => setOpenModal(null)} />
</div>
)}
</motion.div>
<div onClick={() => setOpenModal(null)} className="backdrop" />
</motion.div>
)}
</AnimatePresence>
</div>
)
}