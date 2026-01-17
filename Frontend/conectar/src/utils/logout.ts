export const handleLogout = async () => {
  const res = await fetch('http://localhost:3000/api/usuario/logout', {
    method: 'POST',
    credentials: 'include',
    headers: { "Content-Type": "application/json" },
  })
  if (!res.ok) {
    return false
  } else {
    return true
  }
}