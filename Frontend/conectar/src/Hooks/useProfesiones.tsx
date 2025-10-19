import { useEffect, useState } from "react";
import type { Profesion } from "../interfaces/profesion.ts";



export default function useProfesiones() {
  const [profesiones, setProfesiones] = useState<Profesion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfesiones = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3000/api/profesion/inactive')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const response = await res.json();
      setProfesiones(response.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        setError(err.message);
      } else {
        console.error("fetchProfesiones error: ", err);
        setError("Error al obtener profesiones");
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => { //Para que se ejecute apenas se abre la pagina
    fetchProfesiones();
  }, []);

  const aceptarProfesion = async (nombre: string) => {
    setError(null);
    const snapshot = profesiones;

    setProfesiones(prev => prev.map(p => (p.nombreProfesion === nombre ? { ...p, estado: true } : p)));

    try {
      const res = await fetch(`http://localhost:3000/api/profesion/${nombre}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: true }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        setError(err.message);
        setProfesiones(snapshot);
      } else {
        console.error("fetchProfesiones error: ", err);
        setError("Error al aceptar la profesion, devolvemos cambios");
        setProfesiones(snapshot);
      }
    }
  };

  const rechazarProfesion = async (nombre: string) => {
    setError(null);
    const confirm = window.confirm("¿Seguro que querés rechazar (eliminar) esta profesión?");
    if (!confirm) return;
    const snapshot = profesiones;

    setProfesiones(prev => prev.filter(p => (p.nombreProfesion !== nombre)))

    try {
      const res = await fetch(`http://localhost:3000/api/profesion/${nombre}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`HTPP ${res.status}`)
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        setError(err.message);
        setProfesiones(snapshot);
      } else {
        console.error("fetchProfesiones error: ", err);
        setError("Error al rechazar la profesion, devolvemos cambios");
        setProfesiones(snapshot);
      }
    }
  };

  return {
    profesiones,
    loading,
    error,
    rechazarProfesion,
    aceptarProfesion,
    fetchProfesiones
  }
}