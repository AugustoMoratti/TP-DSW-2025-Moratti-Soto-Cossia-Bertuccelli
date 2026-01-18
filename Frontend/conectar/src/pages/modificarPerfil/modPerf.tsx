import React, { useEffect, useState, useMemo } from "react";
import Modal from "react-modal";
import AddProf from "../../components/profesiones/AddProf.tsx";
import RmProf from "../../components/profesiones/RmProf.tsx";
import HandleHabi from "../../components/habilidades/HandleHabi.tsx";
import StandardInput from "../../components/form/Form";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { fetchMe } from "../../services/auth.services";
import type { ProfileCardProps as User } from "../../interfaces/profilaPropCard";
import "./modPerf.css";
import { type Localidad } from "../../interfaces/localidad.ts";

export default function EditProfile() {
  // usar Partial<User> porque al inicio el objeto puede no tener todas las props
  const [user, setUser] = useState<Partial<User>>({});
  const [clave, setClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");
  const [editable, setEditable] = useState<Partial<Record<keyof User, boolean>>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showClavesModal, setShowClavesModal] = useState(false);
  const [showProfModal, setShowProfModal] = useState(false);
  const [showHabiModal, setShowHabiModal] = useState(false);
  const [pestaña, setPestaña] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      Modal.setAppElement("#root");
    } catch {
      /* ignorar error si ya está seteado */
    }
  }, []);

  // USUARIO
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
        const u = data.data;
        setUser({
          ...u,
          // aquí normalizo a string si venían como objeto
          provincia:
            typeof u?.provincia === "object"
              ? u.provincia?.nombre ?? ""
              : u?.provincia ?? "",
          localidad:
            typeof u?.localidad === "object"
              ? u.localidad?.nombre ?? ""
              : u?.localidad ?? "",
        });
      } catch (err) {
        console.error("Error al cargar usuario:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const toggleEdit = (field: keyof User) => {
    setEditable(prev => {
      const newEditable: Partial<Record<keyof User, boolean>> = {};

      Object.keys(prev).forEach(k => {
        newEditable[k as keyof User] = false;
      });

      newEditable[field] = !prev[field];
      return newEditable;
    });

    setErrors(prev => ({ ...prev, [field]: "" }));
    setSaveError("");
    setSuccessMsg("");
  };


  const handleChange = (field: keyof User, value: string) => {
    if (field === "contacto") {
      if (!/^\d*$/.test(value))
        return setErrors((p) => ({ ...p, contacto: "Solo números" }));
      if (value.length > 15)
        return setErrors((p) => ({
          ...p,
          contacto: "Máximo 15 dígitos",
        }));
      setErrors((p) => ({ ...p, contacto: "" }));
    }
    if (field === "email") {
      setErrors((p) => ({
        ...p,
        email: value.includes("@") ? "" : "Ingrese un email válido",
      }));
    }
    setUser((prev) => ({ ...(prev ?? {}), [field]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!user.id) {
      setSaveError("Usuario no cargado todavía.");
      return;
    }
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
      setUser((prev) => ({ ...(prev ?? {}), fotoUrl: data.data.fotoUrl || prev?.fotoUrl }));
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

    if (!user.contacto || user.contacto.length < 7) {
      setSaveError("El teléfono debe tener al menos 7 dígitos.");
      return;
    }

    if (clave !== confirmarClave) {
      setSaveError("⚠️ Las claves no coinciden.");
      return;
    }

    if (!user.id) {
      setSaveError("Usuario no cargado.");
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

      setEditable(prev =>
        Object.fromEntries(Object.keys(prev).map(k => [k, false])) as Record<keyof User, boolean>
      );

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


  const StaticField: React.FC<{ label: string; value?: string }> = ({
    label,
    value,
  }) => (
    <div className="static-field" aria-label={label}>
      <div className="static-label">{label}</div>
      <div className="static-value">{value || "—"}</div>
    </div>
  );

  const renderField = (
    field: keyof User,
    label: string,
    value?: string,
    type = "text"
  ) => (
    <div className="field-with-action">
      <div className="field-input">
        {editable[field] ? (
          <StandardInput
            label={label}
            value={value || ""}
            onChange={(v) => handleChange(field, v)}
            type={type}
          />
        ) : (
          <StaticField label={label} value={value} />
        )}
      </div>

      <div className="field-buttons">
        <button
          type="button"
          className="btn_modPerf editar-btn"
          onClick={() => toggleEdit(field)}
        >
          {editable[field] ? "Cancelar" : "Editar"} <EditIcon />
        </button>

        {editable[field] && (
          <button
            type="button"
            className="btn_modPerf guardar-btn.visible"
            onClick={handleSaveAll}
          >
            Guardar <SaveIcon />
          </button>
        )}
      </div>
    </div>
  );

  // Normalizar/extraer nombre de provincia/localidad de forma segura
  /*const provinciaNombre = useMemo(() => {
    if (!user.provincia) return "";
    return typeof user.provincia === "string"
      ? user.provincia
      : (user.provincia as any)?.nombre ?? "";
  }, [user.provincia]);*/

  const localidadNombre = useMemo(() => {
    if (!user.localidad) return "";
    return typeof user.localidad === "string"
      ? user.localidad
      : (user.localidad as Localidad)?.nombre ?? "";
  }, [user.localidad]);

  if (loading && !user.nombre)
    return <div className="main-bg">Cargando datos del usuario...</div>;

  if (Object.keys(errors).length > 0)
    return <div className="main-bg">Ocurrió un error...</div>;

  return (
    <section className="main-bg">
      <div className="top-bar">
        <img
          src="../assets/conect_1.png"
          alt="Logo"
          className="logoModPerf"
          onClick={() => navigate("/")}
        />
      </div>

      <div className="card-container-single-card">
        <div className="card-header">
          <span className="card-title">MI PERFIL</span>
        </div>

        <div className="card-content profile-grid-single">
          {/* DATOS */}
          <div className="profile-form">
            <h3>Datos Personales</h3>
            <br />
            {renderField("nombre", "Nombre", user.nombre)}
            {renderField("apellido", "Apellido", user.apellido)}
            {renderField("fechaNac", "Fecha de nacimiento", user.fechaNac, "date")}
            <h3>Ubicación</h3>
            <br />

            {renderField("localidad", "Localidad", localidadNombre)}
            {renderField("direccion", "Dirección", user.direccion)}
            <h3>Contacto</h3>
            <br />
            {renderField("contacto", "Teléfono", user.contacto, "tel")}
            {renderField("email", "Email", user.email, "email")}

            {saveError && <div className="global-error">{saveError}</div>}
            {successMsg && <div className="global-success">{successMsg}</div>}
          </div>

          {/* IMAGEN */}
          <div className="profile-image-section">
            <img
              src={`http://localhost:3000${user.fotoUrl ?? ""}`}
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

            {/* CAMBIAR CLAVE */}
            <button
              className="btn_modPerf"
              style={{ marginTop: 40 }}
              onClick={() => setShowClavesModal(true)}
            >
              Cambiar contraseña
            </button>

            <Modal
              isOpen={showClavesModal}
              onRequestClose={() => setShowClavesModal(false)}
              className="modal"
              overlayClassName="modal_overlay_modPerf"
              ariaHideApp={false}
            >
              <div className="card">
                <h2>Claves de Seguridad</h2>
                <StandardInput
                  label="Clave"
                  value={clave}
                  onChange={setClave}
                  type="password"
                />
                <StandardInput
                  label="Confirmar clave"
                  value={confirmarClave}
                  onChange={setConfirmarClave}
                  type="password"
                />
                {clave !== confirmarClave && confirmarClave && (
                  <div style={{ color: "red" }}>Las claves no coinciden</div>
                )}
                <div>
                  <button
                    className="btn_modPerf"
                    onClick={handleSaveAll}
                    disabled={clave !== confirmarClave}
                  >
                    Guardar <SaveIcon />
                  </button>
                  <button
                    className="btn_modPerf"
                    onClick={() => setShowClavesModal(false)}
                  >
                    Cerrar <DeleteIcon />
                  </button>
                </div>
              </div>
            </Modal>

            {/* PROFESIONES */}
            <button
              className="btn_modPerf"
              style={{ marginTop: 40 }}
              onClick={() => setShowProfModal(true)}
            >
              ¡Quiero gestionar mis profesiones!
            </button>

            <Modal
              isOpen={showProfModal}
              onRequestClose={() => setShowProfModal(false)}
              className="modal"
              overlayClassName="modal_overlay_modPerf"
              ariaHideApp={false}
            >
              <div className="card-modProf">
                <button
                  type="button"
                  className="close_modPerf"
                  onClick={() => setShowProfModal(false)}
                >
                  &times;
                </button>
                <h2>Gestionar Profesiones</h2>
                <div className="pestañas-container">
                  <button
                    className={`btn-pestaña ${!pestaña ? "active" : ""}`}
                    onClick={() => setPestaña(false)}
                  >
                    ➕ Agregar
                  </button>
                  <button
                    className={`btn-pestaña ${pestaña ? "active" : ""}`}
                    onClick={() => setPestaña(true)}
                  >
                    ➖ Quitar
                  </button>
                </div>
                {!pestaña ? <AddProf /> : <RmProf />}
              </div>
            </Modal>

            {/* HABILIDADES */}
            <button
              className="btn_modPerf"
              style={{ marginTop: 40 }}
              onClick={() => setShowHabiModal(true)}
            >
              ¡Quiero gestionar mis habilidades!
            </button>

            <Modal
              isOpen={showHabiModal}
              onRequestClose={() => setShowHabiModal(false)}
              className="modal"
              overlayClassName="modal_overlay_modPerf"
              ariaHideApp={false}
            >
              <div className="card-modProf">
                <button
                  type="button"
                  className="close_modPerf"
                  onClick={() => setShowHabiModal(false)}
                >
                  &times;
                </button>
                <h2>Gestionar Habilidades</h2>
                <HandleHabi />
              </div>
            </Modal>

            <button className="btn_modPerf" style={{ marginTop: 40 }} onClick={() => navigate(-1)}>
              ← Volver
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}