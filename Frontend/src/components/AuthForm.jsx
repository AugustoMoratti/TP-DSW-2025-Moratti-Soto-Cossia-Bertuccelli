import React, { useState } from 'react'


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


export default function AuthForm({ type = 'login', onClose = () => {} }) {
const isRegister = type === 'register'
const [values, setValues] = useState({ name: '', email: '', password: '', terms: false })
const [errors, setErrors] = useState({})


function validate() {
const e = {}
if (isRegister && !values.name.trim()) e.name = 'Ingresa tu nombre.'
if (!values.email.trim()) e.email = 'Ingresa tu email.'
else if (!emailRegex.test(values.email)) e.email = 'Email inválido.'
if (!values.password) e.password = 'Ingresa una contraseña.'
else if (values.password.length < 6) e.password = 'La contraseña debe tener al menos 6 caracteres.'
if (isRegister && !values.terms) e.terms = 'Debes aceptar los términos.'
setErrors(e)
return Object.keys(e).length === 0
}


function handleSubmit(e) {
e.preventDefault()
if (!validate()) return
alert(`${isRegister ? 'Registrado' : 'Logueado'} con: ${values.email}`)
onClose()
}


return (
<form onSubmit={handleSubmit} className="auth-form">
{isRegister && (
<div>
<label>Nombre</label>
<input value={values.name} onChange={(e) => setValues(s => ({ ...s, name: e.target.value }))} />
{errors.name && <div className="error">{errors.name}</div>}
</div>
)}
<div>
<label>Email</label>
<input value={values.email} onChange={(e) => setValues(s => ({ ...s, email: e.target.value }))} />
{errors.email && <div className="error">{errors.email}</div>}
</div>
<div>
<label>Contraseña</label>
<input type="password" value={values.password} onChange={(e) => setValues(s => ({ ...s, password: e.target.value }))} />
{errors.password && <div className="error">{errors.password}</div>}
</div>
{isRegister && (
<div>
<input type="checkbox" checked={values.terms} onChange={(e) => setValues(s => ({ ...s, terms: e.target.checked }))} />
<label>Acepto los términos</label>
{errors.terms && <div className="error">{errors.terms}</div>}
</div>
)}
<div className="form-actions">
<button type="button" onClick={onClose}>Cancelar</button>
<button type="submit">{isRegister ? 'Crear cuenta' : 'Entrar'}</button>
</div>
</form>
)
}