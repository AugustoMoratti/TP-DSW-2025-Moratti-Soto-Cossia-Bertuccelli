import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import StandardInput from "../../components/form/Form";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Profesion } from "../../interfaces/profesion";
import { useNavigate } from "react-router-dom";
import { fetchMe } from "../../services/auth.services";
import type { ProfileCardProps as User } from "../../interfaces/profilaPropCard";
import "./modPerf.css";

export default function EditProfile() {
  const [user, setUser] = useState<User>({} as User);
  const [clave, setClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");
  const [editable, setEditable] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showClavesModal, setShowClavesModal] = useState(false);
  const [showProfModal, setShowProfModal] = useState(false);
  const [query, setQuery] = useState("");
  const [prof, setProf] = useState<Profesion[]>([]);
  const [pestaña, setPestaña] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      Modal.setAppElement("#root");
    } catch {
      /* ignorar */
    }
  }, []);

  // CARGAR USUARIO
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const me = await fetchMe();
        const res = await fetch(`http://localhost:3000/api/usuario/${me.id}`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error al obtener datos del usuario");
        const data = await res.json();
        setUser(data.data);
      } catch (err) {
        console.error("Error al cargar usuario:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  // BUSCAR PROFESIONES
  const handleBuscarProf = async () => {
    if (!query.trim()) return;
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:3000/api/profesion/busqueda?q=${encodeURIComponent(query)}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      const data = await res.json();
      setProf(data.data || []);
    } catch (err) {
      console.error("Error buscando profesiones:", err);
      setSaveError("Error al buscar profesiones.");
    } finally {
      setLoading(false);
    }
  };

  // MODO EDITAR
  const toggleEdit = (field: string) => {
    setEditable((prev) => ({ ...prev, [field]: !prev[field] }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setSaveError("");
    setSuccessMsg("");
  };

  // MANEJO LOS CAMPOS
  const handleChange = (field: keyof User, value: string) => {
    if (field === "contacto") {
      if (!/^\d*$/.test(value))
        return setErrors((p) => ({ ...p, contacto: "Solo números" }));
      if (value.length < 7 || value.length > 15)
        return setErrors((p) => ({ ...p, contacto: "Teléfono entre 7 y 15 dígitos" }));
      setErrors((p) => ({ ...p, contacto: "" }));
    }
    if (field === "email") {
      setErrors((p) => ({
        ...p,
        email: value.includes("@") ? "" : "Ingrese un email válido",
      }));
    }
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  // GUARDO IMAGEN
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("imagen", file);
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/api/usuario/${user.id}`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al subir imagen");
      setUser((prev) => ({ ...prev, fotoUrl: data.fotoUrl || prev.fotoUrl }));
      setSuccessMsg("Imagen actualizada correctamente.");
    } catch (err) {
      console.error(err);
      setSaveError("Error de conexión al subir imagen.");
    } finally {
      setLoading(false);
    }
  };

  // GUARDO DATOS
  const handleSaveAll = async () => {
    setSaveError("");
    setSuccessMsg("");
    if (clave !== confirmarClave) {
      setSaveError("⚠️ Las claves no coinciden.");
      return;
    }
    const payload = {
      nombre: user.nombre,
      apellido: user.apellido,
      fechaNac: user.fechaNac,
      provincia: user.provincia,
      localidad: user.localidad,
      direccion: user.direccion,
      contacto: user.contacto,
      email: user.email,
      clave: clave || undefined,
    };
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/api/usuario/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar usuario");
      setSuccessMsg("Datos actualizados correctamente.");
      setEditable({});
      if (showClavesModal) {
        setShowClavesModal(false);
        setClave("");
        setConfirmarClave("");
      }
    } catch (err) {
      console.error(err);
      setSaveError("Error de conexión al guardar.");
    } finally {
      setLoading(false);
    }
  };

  const StaticField: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
    <div className="static-field" aria-label={label}>
      <div className="static-label">{label}</div>
      <div className="static-value">{value || "—"}</div>
    </div>
  );

  const renderField = (field: keyof User, label: string, value?: string, type = "text") => (
    <div className="field-with-action">
      {editable[field] ? (
        <StandardInput label={label} value={value || ""} onChange={(v) => handleChange(field, v)} type={type} />
      ) : (
        <StaticField label={label} value={value} />
      )}
      <button className="btn_modPerf" onClick={() => toggleEdit(field)}>
        {editable[field] ? "Cancelar" : "Editar"} <EditIcon />
      </button>
      {editable[field] && (
        <button className="btn_modPerf guardar-btn" onClick={handleSaveAll} type="button">
          Guardar <SaveIcon />
        </button>
      )}
    </div>
  );

  if (loading && !user.nombre) return <div className="main-bg">Cargando datos del usuario...</div>;

  return (
    <section className="main-bg">
      <div className="top-bar">
        <img src="../assets/conect_1.png" alt="Logo" className="logoModPerf" onClick={() => navigate("/")} />
      </div>

      <div className="card-container-single-card">
        <div className="card-header">
          <span className="card-title">MI PERFIL</span>
        </div>

        <div className="card-content profile-grid-single">
          <div className="profile-form">
            <h3>Datos Personales</h3>
            {renderField("nombre", "Nombre", user.nombre)}
            {renderField("apellido", "Apellido", user.apellido)}
            {renderField("fechaNac", "Fecha de nacimiento", user.fechaNac, "date")}
            <h3>Datos de Ubicación</h3>
            {renderField("provincia", "Provincia", user.provincia)}
            {renderField("localidad", "Localidad", user.localidad)}
            {renderField("direccion", "Dirección", user.direccion)}
            <h3>Datos de Contacto</h3>
            {renderField("contacto", "Teléfono", user.contacto, "tel")}
            {renderField("email", "Email", user.email, "email")}

            {saveError && <div className="global-error">{saveError}</div>}
            {successMsg && <div className="global-success">{successMsg}</div>}
          </div>

          <div className="profile-image-section">
            <img
              src={`http://localhost:3000${user.fotoUrl}`}
              alt="Foto de perfil"
              className="profile-image"
            />
            <input
              id="fileInput"
              style={{ display: "none" }}
              type="file"
              accept=".jpg,.png"
              onChange={handleFileChange}
            />
            <label htmlFor="fileInput" className="btn_modPerf change-photo-btn">
              Cambiar imagen
            </label>

            <button className="btn_modPerf" style={{ marginTop: 40 }} onClick={() => setShowClavesModal(true)}>
              Cambiar contraseña
            </button>

            <Modal
              isOpen={showClavesModal}
              onRequestClose={() => setShowClavesModal(false)}
              className="modal"
              overlayClassName="modal_overlay_modPerf"
            >
              <div className="card">
                <h2>Claves de Seguridad</h2>
                <StandardInput label="Clave" value={clave} onChange={setClave} type="password" />
                <StandardInput label="Confirmar clave" value={confirmarClave} onChange={setConfirmarClave} type="password" />
                {clave !== confirmarClave && confirmarClave && (
                  <div style={{ color: "red" }}>Las claves no coinciden</div>
                )}
                <div>
                  <button className="btn_modPerf" onClick={handleSaveAll} disabled={clave !== confirmarClave}>
                    Guardar <SaveIcon />
                  </button>
                  <button className="btn_modPerf" onClick={() => setShowClavesModal(false)}>
                    Cerrar <DeleteIcon />
                  </button>
                </div>
              </div>
            </Modal>

            <button className="btn_modPerf" style={{ marginTop: 40 }} onClick={() => setShowProfModal(true)}>
              ¡Quiero agregar profesiones!
            </button>

            <Modal
              isOpen={showProfModal}
              onRequestClose={() => setShowProfModal(false)}
              className="modal"
              overlayClassName="modal_overlay_modPerf"
            >
              <div className="card-modProf">
                <button type="button" className="close_modPerf" onClick={() => setShowProfModal(false)}>
                  &times;
                </button>

                <h2>Gestionar Profesiones</h2>
                <div className="pestañas-container">
                  <button className={`btn-pestaña ${!pestaña ? "active" : ""}`} onClick={() => setPestaña(false)}>
                    ➕ Agregar
                  </button>
                  <button className={`btn-pestaña ${pestaña ? "active" : ""}`} onClick={() => setPestaña(true)}>
                    ➖ Quitar
                  </button>
                </div>

                {!pestaña ? (
                  <div>
                    <input
                      type="text"
                      className="buscador_modPerf"
                      placeholder="Busque una profesión..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleBuscarProf()}
                    />
                    {loading && <p>Cargando...</p>}
                    <div className="resultados-prof">
                      {prof.map((p) => (
                        <div key={p.nombreProfesion} className="prof-item">
                          <span>{p.nombreProfesion}</span>
                          <button className="btn_modPerf small">Agregar</button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4>Profesiones actuales:</h4>
                    {user.profesiones?.length ? (
                      <ul className="prof-list">
                        {user.profesiones.map((p) => (
                          <li key={p.nombreProfesion}>
                            {p.nombreProfesion}
                            <button className="btn_modPerf small danger">Quitar</button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No tienes profesiones asignadas.</p>
                    )}
                  </div>
                )}
              </div>
            </Modal>
          </div>
        <div>
        <button
          className="btn_modPerf"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>
      </div>
        </div>
      </div>
    </section>
  );
}
