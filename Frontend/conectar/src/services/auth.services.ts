export const fetchMe = async () => {
  const res = await fetch('http://localhost:3000/api/usuario/me', {
    method: "GET",
    credentials: 'include', // importante si usás cookie HttpOnly
    headers: {
      'Content-Type': 'application/json',
      // Si usás token en header en lugar de cookie:
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
  });

  if (!res.ok) {
    throw new Error('No autorizado');
  }

  const data = await res.json();
  return data.usuario; // { id, nombre, email }
};