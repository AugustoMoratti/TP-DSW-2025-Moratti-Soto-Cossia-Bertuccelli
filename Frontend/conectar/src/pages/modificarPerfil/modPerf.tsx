import React, { useEffect, useState } from "react";
import StandardInput from '../../components/form/Form.tsx';
import { Button } from '../../components/button/Button.tsx';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from "react-router-dom";
import './modPerf.css';

type UserData = {
  id?: string;
  nombre?: string;
  apellido?: string;
  fechaNac?: string;
  provincia?: string;
  localidad?: string;
  direccion?: string;
  contacto?: string;
  email?: string;
};

export default function EditProfile() {
  const [user, setUser] = useState<UserData>({});
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
        const res = await fetch('http://localhost:3000/api/usuario/${user.id}', {
          method: 'GET',
          headers: {'Content-Type': 'application/json',},
          credentials: 'include'
        });
        const data = await res.json();
        if (!res.ok) {
          navigate("/login");
          return;
        }
        setUser({
          id: data.id || data._id,
          nombre: data.nombre || "",
          apellido: data.apellido || "",
          fechaNac: data.fechaNac || "",
          provincia: data.provincia || "",
          localidad: data.localidad || "",
          direccion: data.direccion || "",
          contacto: data.contacto || "",
          email: data.email || ""
        });
      } catch (err) {
        console.error(err);
        setSaveError("Error de conexión al obtener usuario.");
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

  const handleChange = (field: keyof UserData, value: string) => {
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
      const res = await fetch('http://localhost:3000/api/usuario/${user.id}', {
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
          email: user.email
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
        <img src="../assets/conect_1.png" alt="Logo" className="logo" onClick={() => navigate("/")} />
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">MI PERFIL</span>
        </div>

        <div className="card-content">
        <div className="fields-box">
          <div className="field-with-action">
            {editable.nombre ? (
              <StandardInput label="Nombre" value={user.nombre || ""} onChange={(v) => handleChange("nombre", v)} />
            ) : (
              <StaticField label="Nombre" value={user.nombre} />
            )}
            <Button variant="outlined" className="edit-btn" icon={<EditIcon />} onClick={() => toggleEdit("nombre")}>
              {editable.nombre ? "Cancelar" : "Editar"}
            </Button>
          </div>

          <div className="field-with-action">
            {editable.apellido ? (
              <StandardInput label="Apellido" value={user.apellido || ""} onChange={(v) => handleChange("apellido", v)} />
            ) : (
              <StaticField label="Apellido" value={user.apellido} />
            )}
            <Button variant="outlined" className="edit-btn" icon={<EditIcon />} onClick={() => toggleEdit("apellido")}>
              {editable.apellido ? "Cancelar" : "Editar"}
            </Button>
          </div>

          <div className="field-with-action">
            {editable.fechaNac ? (
              <StandardInput label="Fecha de nacimiento" value={user.fechaNac || ""} onChange={(v) => handleChange("fechaNac", v)} type="date" />
            ) : (
              <StaticField label="Fecha de nacimiento" value={user.fechaNac} />
            )}
            <Button variant="outlined" className="edit-btn" icon={<EditIcon />} onClick={() => toggleEdit("fechaNac")}>
              {editable.fechaNac ? "Cancelar" : "Editar"}
            </Button>
          </div>

          <div className="field-with-action">
            {editable.provincia ? (
              <StandardInput label="Provincia" value={user.provincia || ""} onChange={(v) => handleChange("provincia", v)} />
            ) : (
              <StaticField label="Provincia" value={user.provincia} />
            )}
            <Button variant="outlined" className="edit-btn" icon={<EditIcon />} onClick={() => toggleEdit("provincia")}>
              {editable.provincia ? "Cancelar" : "Editar"}
            </Button>
          </div>

          <div className="field-with-action">
            {editable.localidad ? (
              <StandardInput label="Localidad" value={user.localidad || ""} onChange={(v) => handleChange("localidad", v)} />
            ) : (
              <StaticField label="Localidad" value={user.localidad} />
            )}
            <Button variant="outlined" className="edit-btn" icon={<EditIcon />} onClick={() => toggleEdit("localidad")}>
              {editable.localidad ? "Cancelar" : "Editar"}
            </Button>
          </div>

          <div className="field-with-action">
            {editable.direccion ? (
              <StandardInput label="Dirección" value={user.direccion || ""} onChange={(v) => handleChange("direccion", v)} />
            ) : (
              <StaticField label="Dirección" value={user.direccion} />
            )}
            <Button variant="outlined" className="edit-btn" icon={<EditIcon />} onClick={() => toggleEdit("direccion")}>
              {editable.direccion ? "Cancelar" : "Editar"}
            </Button>
          </div>

          <div className="field-with-action">
            {editable.contacto ? (
              <StandardInput label="Teléfono" value={user.contacto || ""} onChange={(v) => handleChange("contacto", v)} type="tel" />
            ) : (
              <StaticField label="Teléfono" value={user.contacto} />
            )}
            <Button variant="outlined" className="edit-btn" icon={<EditIcon />} onClick={() => toggleEdit("contacto")}>
              {editable.contacto ? "Cancelar" : "Editar"}
            </Button>
          </div>
          {errors.contacto && <div className="field-error">{errors.contacto}</div>}

          <div className="field-with-action">
            {editable.email ? (
              <StandardInput label="Email" value={user.email || ""} onChange={(v) => handleChange("email", v)} type="email" />
            ) : (
              <StaticField label="Email" value={user.email} />
            )}
            <Button variant="outlined" className="edit-btn" icon={<EditIcon />} onClick={() => toggleEdit("email")}>
              {editable.email ? "Cancelar" : "Editar"}
            </Button>
          </div>
          {errors.email && <div className="field-error">{errors.email}</div>}

          <div className="card-actions">
            <Button variant="contained" className="save-btn" icon={<SaveIcon />} onClick={handleSaveAll} type="button">
              Guardar
            </Button>

            <Button variant="contained" className="back-btn" onClick={() => navigate("/")}>
              Volver
            </Button>
          </div>

          {saveError && <div className="global-error">{saveError}</div>}
          {successMsg && <div className="global-success">{successMsg}</div>}
        </div>
      </div>
      </div>
    </section>
  );
}
