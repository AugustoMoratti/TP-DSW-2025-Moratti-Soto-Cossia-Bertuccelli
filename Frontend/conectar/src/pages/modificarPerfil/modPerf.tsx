import React, { useEffect, useState } from "react";
import StandardInput from '../../components/form/Form.tsx';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from "react-router-dom";
import { fetchMe } from "../../services/auth.services.ts";
import type { ProfileCardProps as user} from "../../interfaces/profilaPropCard.tsx";
import './modPerf.css';

export default function EditProfile() {
  const [user, setUser] = useState<user>({} as user);
  const [editable, setEditable] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
  const fetchUser = async () => {
    try {
      setLoading(true);
      
      const me = await fetchMe();

      const res = await fetch(`http://localhost:3000/api/usuario/${me.id}`, {
        method: "GET",
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error("Error al obtener datos del usuario");
      }

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
    setEditable(prev => ({ ...prev, [field]: !prev[field] }));
    setErrors(prev => ({ ...prev, [field]: "" }));
    setSaveError("");
    setSuccessMsg("");
  };

  const handleChange = (field: keyof user, value: string) => {
    if (field === "contacto") {
      if (!/^\d*$/.test(value)) {
        setErrors(prev => ({ ...prev, contacto: "Solo se permiten números" }));
        return;
      } else {
        setErrors(prev => ({ ...prev, contacto: "" }));
      }
      if (value.length < 7 || value.length > 15) {
        setErrors(prev => ({ ...prev, contacto: "Teléfono entre 7 y 15 dígitos" }));
      } else {
        setErrors(prev => ({ ...prev, contacto: "" }));
      }
    }

    if (field === "email") {
      if (value && !value.includes("@")) {
        setErrors(prev => ({ ...prev, email: "Ingrese un email válido" }));
      } else {
        setErrors(prev => ({ ...prev, email: "" }));
      }
    }

    setUser(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveAll = async () => {
    setSaveError("");
    setSuccessMsg("");
    if (!user.nombre || !user.apellido || !user.email) {
      setSaveError("Completa nombre, apellido y email antes de guardar.");
      return;
    }
    if (errors.email || errors.contacto) {
      setSaveError("Corrige los errores antes de guardar.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/api/usuario/${user.id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',},
        credentials: 'include',
        body: JSON.stringify({
          id: user.id,
          nombre: user.nombre,
          apellido: user.apellido,
          fechaNac: user.fechaNac,
          provincia: user.provincia,
          localidad: user.localidad,
          direccion: user.direccion,
          contacto: user.contacto,
          email: user.email,
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.error || "Error al guardar usuario.");
        return;
      }

      setSuccessMsg("Datos actualizados correctamente.");
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
        <img src="../assets/conect_1.png" alt="Logo" className="logoModPerf" onClick={() => navigate("/")} />
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">MI PERFIL</span>
        </div>

        <div className="card-content">
        <div className="fields-box">
        <div className="field-with-action">
          { editable.nombre ? (
            <StandardInput label="Nombre" value={user.nombre || ""} onChange={(v) =>  handleChange("nombre", v)} />
          ) : (
            <StaticField label="Nombre" value={user.nombre} />
          )}

          <button className="btn_modPerf" onClick={() => toggleEdit("nombre")}>
            {editable.nombre ? "Cancelar" : "Editar"}
            <EditIcon />
          </button>
          {editable.nombre && (
            <button
              className={`btn_modPerf guardar-btn ${editable.nombre ? "visible" : ""}`}
              onClick={handleSaveAll}
              type="button"
            >
              Guardar
              <SaveIcon />
            </button>
          )}
        </div>

          <div className="field-with-action">
            {editable.apellido ? (
              <StandardInput label="Apellido" value={user.apellido || ""} onChange={(v) => handleChange("apellido", v)} />
            ) : (
              <StaticField label="Apellido" value={user.apellido} />
            )}
            <button className='btn_modPerf' onClick={() => toggleEdit("apellido")}>
              {editable.apellido ? "Cancelar" : "Editar"}
              <EditIcon />
            </button>
            {editable.apellido && (
            <button
              className={`btn_modPerf guardar-btn ${editable.apellido ? "visible" : ""}`}
              onClick={handleSaveAll}
              type="button"
            >
              Guardar
              <SaveIcon />
            </button>
          )}
          </div>

          <div className="field-with-action">
            {editable.fechaNac ? (
              <StandardInput label="Fecha de nacimiento" value={user.fechaNac || ""} onChange={(v) => handleChange("fechaNac", v)} type="date" />
            ) : (
              <StaticField label="Fecha de nacimiento" value={user.fechaNac} />
            )}
            <button className='btn_modPerf' onClick={() => toggleEdit("fechaNac")}>
              {editable.fechaNac ? "Cancelar" : "Editar"}
              <EditIcon />
            </button>
            {editable.fechaNac && (
            <button
              className={`btn_modPerf guardar-btn ${editable.fechaNac ? "visible" : ""}`}
              onClick={handleSaveAll}
              type="button"
            >
              Guardar
              <SaveIcon />
            </button>
          )}
          </div>

          <div className="field-with-action">
            {editable.provincia ? (
              <StandardInput label="Provincia" value={user.provincia || ""} onChange={(v) => handleChange("provincia", v)} />
            ) : (
              <StaticField label="Provincia" value={user.provincia} />
            )}
            <button className='btn_modPerf' onClick={() => toggleEdit("provincia")}>
              {editable.provincia ? "Cancelar" : "Editar"}
              <EditIcon />
            </button>
            {editable.provincia && (
            <button
              className={`btn_modPerf guardar-btn ${editable.provincia ? "visible" : ""}`}
              onClick={handleSaveAll}
              type="button"
            >
              Guardar
              <SaveIcon />
            </button>
          )}
          </div>

          <div className="field-with-action">
            {editable.localidad ? (
              <StandardInput label="Localidad" value={user.localidad || ""} onChange={(v) => handleChange("localidad", v)} />
            ) : (
              <StaticField label="Localidad" value={user.localidad} />
            )}
            <button className='btn_modPerf' onClick={() => toggleEdit("localidad")}>
              {editable.localidad ? "Cancelar" : "Editar"}
              <EditIcon />
            </button>
            {editable.localidad && (
            <button
              className={`btn_modPerf guardar-btn ${editable.localidad ? "visible" : ""}`}
              onClick={handleSaveAll}
              type="button"
            >
              Guardar
              <SaveIcon />
            </button>
          )}
          </div>

          <div className="field-with-action">
            {editable.direccion ? (
              <StandardInput label="Dirección" value={user.direccion || ""} onChange={(v) => handleChange("direccion", v)} />
            ) : (
              <StaticField label="Dirección" value={user.direccion} />
            )}
            <button className='btn_modPerf' onClick={() => toggleEdit("direccion")}>
              {editable.direccion ? "Cancelar" : "Editar"}
              <EditIcon />
            </button>
            {editable.direccion && (
            <button
              className={`btn_modPerf guardar-btn ${editable.direccion ? "visible" : ""}`}
              onClick={handleSaveAll}
              type="button"
            >
              Guardar
              <SaveIcon />
            </button>
          )}
          </div>

          <div className="field-with-action">
            {editable.contacto ? (
              <StandardInput label="Teléfono" value={user.contacto || ""} onChange={(v) => handleChange("contacto", v)} type="tel" />
            ) : (
              <StaticField label="Teléfono" value={user.contacto} />
            )}
            <button className='btn_modPerf' onClick={() => toggleEdit("contacto")}>
              {editable.contacto ? "Cancelar" : "Editar"}
              <EditIcon />
            </button>
            {editable.contacto && (
            <button
              className={`btn_modPerf guardar-btn ${editable.contacto ? "visible" : ""}`}
              onClick={handleSaveAll}
              type="button"
            >
              Guardar
              <SaveIcon />
            </button>
          )}
          </div>
          {errors.contacto && <div className="field-error">{errors.contacto}</div>}

          <div className="field-with-action">
            {editable.email ? (
              <StandardInput label="Email" value={user.email || ""} onChange={(v) => handleChange("email", v)} type="email" />
            ) : (
              <StaticField label="Email" value={user.email} />
            )}
            <button className='btn_modPerf' onClick={() => toggleEdit("email")}>
              {editable.email ? "Cancelar" : "Editar"}
              <EditIcon />
            </button>
            {editable.email && (
            <button
              className={`btn_modPerf guardar-btn ${editable.email ? "visible" : ""}`}
              onClick={handleSaveAll}
              type="button"
            >
              Guardar
              <SaveIcon />
            </button>
          )}
          </div>
          {errors.email && <div className="field-error">{errors.email}</div>}

          <div className="card-actions">

            <button className='btn_modPerf' onClick={() => navigate(-1)}>
              Volver
            </button>
          </div>

          {saveError && <div className="global-error" style={{ color: 'red'}}>{saveError}</div>}
          {successMsg && <div className="global-success" style={{ color: 'red'}}>{successMsg}</div>}
        </div>
      </div>
      </div>
    </section>
  );
}
