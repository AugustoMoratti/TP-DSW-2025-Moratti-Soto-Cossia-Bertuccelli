import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import StandardInput from "../../components/form/Form.tsx";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import { fetchMe } from "../../services/auth.services.ts";
import type { ProfileCardProps as user } from "../../interfaces/profilaPropCard.tsx";
import "./modPerf.css";


export default function EditProfile() {
  const [user, setUser] = useState<user>({} as user);
  const [clave, setClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [editable, setEditable] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showClavesModal, setShowClavesModal] = useState(false);
  const [ShowProfModal, setShowProfModal] = useState(false);
  const [query, setQuery] = useState('');
  const [prof, setProf] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    try {
      Modal.setAppElement("#root");

    } catch {
      // Ignorar errores en entornos sin DOM
    }
  }, []);

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
  }, []);

  const toggleEdit = (field: string) => {
    setEditable((prev) => ({ ...prev, [field]: !prev[field] }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setSaveError("");
    setSuccessMsg("");
  };

  const handleBuscarUsuarios = () => {
    if (!query.trim()) return;

    setLoading(true);
    fetch(`http://localhost:3000/api/profeiones/buscar?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        setProf(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error buscando usuarios:', err);
        setLoading(false);
      });
  };

  const handleChange = (field: keyof user, value: string) => {
    if (field === "contacto") {
      if (!/^\d*$/.test(value)) {
        setErrors((prev) => ({ ...prev, contacto: "Solo se permiten números" }));
        return;
      } else {
        setErrors((prev) => ({ ...prev, contacto: "" }));
      }
      if (value.length < 7 || value.length > 15) {
        setErrors((prev) => ({ ...prev, contacto: "Teléfono entre 7 y 15 dígitos" }));
      } else {
        setErrors((prev) => ({ ...prev, contacto: "" }));
      }
    }

    if (field === "email") {
      if (value && !value.includes("@")) {
        setErrors((prev) => ({ ...prev, email: "Ingrese un email válido" }));
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    }

    setUser((prev) => ({ ...prev, [field]: value }));
  };

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
    if (!res.ok) {
      console.error("Error al subir imagen:", data);
      setSaveError(data.error || "Error al subir imagen.");
      return;
    }

    setUser((prev) => ({ ...prev, fotoUrl: data.fotoUrl || prev.fotoUrl }));
    setSuccessMsg("Imagen actualizada correctamente.");
  } catch (err) {
    console.error(err);
    setSaveError("Error de conexión al subir imagen.");
  } finally {
    setLoading(false);
  }
};


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
    if (!res.ok) {
      console.error("Error en respuesta del servidor:", data);
      setSaveError(data.error || "Error al guardar usuario.");
      return;
    }

    console.log("Respuesta guardado:", data);
    setSuccessMsg("Datos actualizados correctamente.");

    if (showClavesModal) {
      setShowClavesModal(false);
      setClave("");
      setConfirmarClave("");
    }

    setEditable({});
  } catch (err) {
    console.error(err);
    setSaveError("Error de conexión al guardar.");
  } finally {
    setLoading(false);
  }
};



  if (loading && !user.nombre) {
    return <div className="main-bg">Cargando datos del usuario...</div>;
  }

  const StaticField: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
    <div className="static-field" aria-label={label}>
      <div className="static-label">{label}</div>
      <div className="static-value">{value || "—"}</div>
    </div>
  );

return (
  <section className="main-bg">
    <div className="top-bar">
      <img
        src="../assets/conect_1.png"
        alt="Logo"
        className="logoModPerf"
        onClick={() => navigate("/")}
      />
      <button className="btn_modPerf"></button>
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

        <div className="divisor-mod-perf"></div>

          <h3>Datos de Ubicación</h3>
          {renderField("provincia", "Provincia", user.provincia)}
          {renderField("localidad", "Localidad", user.localidad)}
          {renderField("direccion", "Dirección", user.direccion)}

        <div className="divisor-mod-perf"></div>

          <h3>Datos de Contacto</h3>
          {renderField("contacto", "Teléfono", user.contacto, "tel")}
          {errors.contacto && <div className="field-error">{errors.contacto}</div>}

          {renderField("email", "Email", user.email, "email")}
          {errors.email && <div className="field-error">{errors.email}</div>}

        <div className="divisor-mod-perf"></div>

          <div className="card-actions">
            <button className="btn_modPerf" onClick={() => navigate(-1)}>
              Volver
            </button>
          </div>

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
            style={{ display: 'none' }}
            type="file"
            accept=".jpg,.png"
            onChange={handleFileChange}
          />
          <label htmlFor="fileInput" className="btn_modPerf change-photo-btn">
            Cambiar imagen
          </label>
          <button className="btn_modPerf" style={{ marginTop: '40px'}} onClick={() => setShowClavesModal(true)}>
            Quiero cambiar mi contraseña
          </button>
          <Modal
            isOpen={showClavesModal}
            onRequestClose={() => setShowClavesModal(false)}
            contentLabel="Claves Modal"
            className="modal"
            overlayClassName="modal_overlay_modPeft"
          >
            <div className="card">
            <h2>Claves de Seguridad</h2>
            {<StandardInput label="Clave" value={clave} onChange={setClave} type="password" />}
            {<StandardInput label="Confirmar clave" value={confirmarClave} onChange={setConfirmarClave} type="password" />}
            {confirmarClave && clave !== confirmarClave && (
              <div style={{ color: 'red', fontSize: '0.95em', marginBottom: '0.5em' }}>
                Las claves no coinciden
              </div>
            )}
            <div>
            <button
              className={'btn_modPerf'}
              onClick={handleSaveAll}
              disabled={clave !== confirmarClave}
              type="button"
            >
              Guardar <SaveIcon />
            </button>
            <button 
              className="btn_modPerf"
              onClick={() => setShowClavesModal(false)}
            >
              Cerrar <DeleteIcon/>
            </button>
            </div>
            </div>
          </Modal>
          <button className="btn_modPerf" style={{ marginTop: '40px'}} onClick={() => setShowProfModal(true)}>
            Quiero agregar profesiones!
          </button>
          <Modal
            isOpen={ShowProfModal}
            onRequestClose={() => setShowProfModal(false)}
            contentLabel="Gestionar Profesiones Modal"
            className="modal"
            overlayClassName="modal_overlay_modPeft"
          >
            <div>
              <button
                type="button"
                className="close_modPerf"
                onClick={() => setShowProfModal(false)}
                aria-label="Cerrar"
              >
                &times;
              </button>
              <div className="card">
              <h2>Gestionar Profesiones</h2>
              <input
                type="text"
                className="buscador"
                placeholder="Busque una profesion!"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleBuscarUsuarios()} 
              />
              
              {loading && <p>cargando...</p>}

              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  </section>
);


function renderField(field: keyof user, label: string, value?: string, type = "text") {
  return (
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
        <button
          className={`btn_modPerf guardar-btn ${editable[field] ? "visible" : ""}`}
          onClick={handleSaveAll}
          type="button"
        >
          Guardar <SaveIcon />
        </button>
      )}
    </div>
  );
} 
}
