export const fetchMe = async () => {
  const res = await fetch('http://localhost:3000/api/usuario/me', {
    method: "GET",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('No autorizado');
  }

  const data = await res.json();
  return data.usuario; // { id, nombre, email }
};

export const fetchMeAdmin = async () => {
  const resp = await fetch('http://localhost:3000/api/admin/me', {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });


  if (!resp.ok) {
    throw new Error('No autorizado');
  }

  const data = await resp.json();
  return data.admin; // { id, nombre, email }
};