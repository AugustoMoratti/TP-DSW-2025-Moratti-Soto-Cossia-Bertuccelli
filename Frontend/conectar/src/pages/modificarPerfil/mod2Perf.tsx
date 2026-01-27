import { useEffect, useState } from "react";
import { type Usuario } from "../../interfaces/usuario.ts";
import { fetchMe } from "../../services/auth.services.ts";
import { useNavigate } from "react-router";

export default function EditProfile2() {
  const navigate = useNavigate()
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const me = await fetchMe()
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3000/api/usuario/${me.id}`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error al obtener datos del usuario");
        const data = await res.json();
        const u: Usuario = data.data
        setUser(u)
      }
      catch (err) {
        console.error("Error al cargar usuario:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [navigate])

  return (


    <section>
      {loading && (
        <div style={{ color: "white", fontSize: "0.9em" }}>Estamos cargando el contenido</div>
      )}

      <div className="top-bar">
        <img
          src="../assets/conect_1.png"
          alt="Logo"
          className="logoModPerf"
          onClick={() => navigate("/")}
        />
      </div>

      {user && (
        <div className="info-container">

          <div className="card-header">
            <span className="card-title">Mi Perfil</span>
          </div>

          <div className="card-content profile-grid-single">
            <div className="div-contacto">
              <p></p>
              <p></p>
              <img
                src={user?.fotoUrl ? `http://localhost:3000${user.fotoUrl}` : ""}
                alt="Foto de perfil"
                className="profile-image"
              />
            </div>

            <div className="div-ubicacion">
              <p></p>
              <p></p>
            </div>

            <div className="div-datos-personales">
              <p></p>
              <p></p>
              <p></p>
            </div>
          </div>

        </div>
      )}

      <div>
        <button>Guardar cambios</button>
      </div>

    </section>

  )


}