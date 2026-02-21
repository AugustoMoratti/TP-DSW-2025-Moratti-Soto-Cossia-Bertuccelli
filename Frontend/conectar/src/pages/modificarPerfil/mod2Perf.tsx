import { useEffect, useState } from "react";
import { type Usuario } from "../../interfaces/usuario.ts";
import { fetchMe } from "../../services/auth.services.ts";
import { useNavigate } from "react-router";
import Modal from "react-modal";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import StandardInput from "../../components/form/Form.tsx";
import RmProf from "../../components/profesiones/RmProf.tsx";
import AddProf from "../../components/profesiones/AddProf.tsx";
import HandleHabi from "../../components/habilidades/HandleHabi.tsx";
import type { HTMLInputTypeAttribute } from "react";
import "./modPerf.css";

export default function EditProfile2() {
  const navigate = useNavigate()
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false)
  const [showClavesModal, setShowClavesModal] = useState(false);
  const [showCambiosModal, setShowCambiosModal] = useState<HTMLInputTypeAttribute | null>(null); //Si no es null se abre el modal, en caso contrario se cierra
  const [showProfModal, setShowProfModal] = useState(false);
  const [showHabiModal, setShowHabiModal] = useState(false);
  const [pestaña, setPestaña] = useState(false);
  const [clave, setClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");
  const [errorGuardado, setErrorGuardado] = useState<string>()
  const [guardadoExitoso, setGuardadoExitoso] = useState<string>()
  const [nombrePropiedad, setNombrePropiedad] = useState<string>("")
  const [nuevoContenido, setNuevoContenido] = useState<string>("")
  const [hayCambios, setHayCambios] = useState(false);

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
  }, [navigate, guardadoExitoso])
  //________________________________________________________________________________________________________________________

  useEffect(() => { //para que cuando de f5 o salir de la pagina le recuerde si hay cambios pendientes
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hayCambios) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hayCambios]);
  //________________________________________________________________________________________________________________________

  const saveUser = () => {
    if (!user || !nuevoContenido.trim()) return;

    switch (nombrePropiedad) {
      case "email":
        user.email = nuevoContenido;
        break;

      case "contacto":
        user.contacto = nuevoContenido;
        break;

      case "localidad":
        user.localidad.nombre = nuevoContenido;
        break;

      case "direccion":
        user.direccion = nuevoContenido;
        break;

      default:
        return; // propiedad no reconocida
    }
    setHayCambios(true)
    setShowCambiosModal(null);
    setNuevoContenido("");
  };
  //________________________________________________________________________________________________________________________

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user !== null) {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!user.id) {
        setErrorGuardado("Usuario no cargado todavía.");
        return;
      }
      const formData = new FormData(); //necesario para pasar archivo y no texto normal json
      formData.append("imagen", file); //agregamos al formdata
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3000/api/usuario/${user.id}`, {
          method: "PATCH",
          credentials: "include",
          body: formData,
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Error al subir imagen");
        setGuardadoExitoso("Imagen actualizada correctamente.");
      } catch (err) {
        console.error(err);
        setErrorGuardado("Error de conexión al subir imagen.");
      } finally {
        setLoading(false);
      }
    }
  };
  //________________________________________________________________________________________________________________________

  const handleSaveAll = async () => {

    if (user !== null) {
      if (!user!.contacto || user!.contacto.length < 7) {
        setErrorGuardado("El teléfono debe tener al menos 7 dígitos.");
        return;
      }

      if (clave !== confirmarClave) {
        setErrorGuardado("⚠️ Las claves no coinciden.");
        return;
      }

      if (!user!.id) {
        setErrorGuardado("Usuario no cargado.");
        return;
      }

      const payload = {
        nombre: user.nombre,
        apellido: user.apellido,
        fechaNac: user.fechaNac,
        provincia: user.provincia,
        localidad: user.localidad.nombre,
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

        setGuardadoExitoso("Datos actualizados correctamente.");
        setHayCambios(false)
        if (showClavesModal) {
          setShowClavesModal(false);
          setClave("");
          setConfirmarClave("");
        }
      } catch (err) {
        console.error(err);
        setErrorGuardado("Error de conexión al guardar.");
      } finally {
        setLoading(false);
      }

    }
  };
  //________________________________________________________________________________________________________________________



  return (


    <section>
      {loading && (
        <div style={{ color: "white", fontSize: "0.9em" }}>Estamos cargando el contenido</div>
      )}
      {/*________________________________________________________________________________________________________________________*/}

      <div className="top-bar">
        <img
          src="../assets/conect_1.png"
          alt="Logo"
          className="logoModPerf"
          onClick={() => navigate("/")}
        />
      </div>
      {/*________________________________________________________________________________________________________________________*/}

      {user && (
        <div className="card-container-single-card">
          {/*________________________________________________________________________________________________________________________*/}

          <div className="card-header">
            <span className="card-title">Mi Perfil</span>
          </div>
          {/*________________________________________________________________________________________________________________________*/}

          <div className="card-content profile-grid-single">

            <div className="div-imagen">
              <div className="field-with-action">
                <img
                  src={user?.fotoUrl ? `http://localhost:3000${user.fotoUrl}` : ""}
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
              </div>

            </div>
            {/*________________________________________________________________________________________________________________________*/}

            <div className="div-contacto">

              <h3>Datos de Contacto</h3>

              <div className="field-with-action">
                <p>Telefono</p>
                <p >{user.contacto}</p>
                <button
                  type="button"
                  className="btn_modPerf editar-btn"
                  onClick={() => {
                    setShowCambiosModal("number");
                    setNombrePropiedad("contacto");
                  }
                  }
                >
                  Editar <EditIcon />
                </button>
              </div>

              <div className="field-with-action">
                <p>Email</p>
                <p>{user.email}</p>
                <button
                  type="button"
                  className="btn_modPerf editar-btn"
                  onClick={() => {
                    setShowCambiosModal("email");
                    setNombrePropiedad("email");
                  }}
                >
                  Editar <EditIcon />
                </button>
              </div>

            </div>
            {/*________________________________________________________________________________________________________________________*/}

            <div className="div-ubicacion">

              <h3>Ubicacion</h3>

              <div className="field-with-action">
                <p>Localidad</p>
                <p>{user.localidad.nombre}</p>
                <button
                  type="button"
                  className="btn_modPerf editar-btn"
                  onClick={() => {
                    setShowCambiosModal("text");
                    setNombrePropiedad("localidad");
                  }
                  }
                >
                  Editar <EditIcon />
                </button>
              </div>

              <div className="field-with-action">
                <p>Direccion</p>
                <p>{user.direccion}</p>
                <button
                  type="button"
                  className="btn_modPerf editar-btn"
                  onClick={() => {
                    setShowCambiosModal("text");
                    setNombrePropiedad("direccion");
                  }}
                >
                  Editar <EditIcon />
                </button>
              </div>

            </div>
            {/*________________________________________________________________________________________________________________________*/}

            <div className="div-datos-personales">

              <h3>Datos Personales</h3>

              <div className="field-with-action">
                <p>Nombre</p>
                <p>{user.nombre}</p>
              </div>

              <div className="field-with-action">
                <p>Apellido</p>
                <p>{user.apellido}</p>
              </div>

              <div className="field-with-action">
                <p>Fecha de Nacimiento</p>
                <p>{user.fechaNac}</p>
              </div>

              {/*MODAL DE CAMBIOS NORMALES*/}
              <Modal
                isOpen={showCambiosModal !== null}
                onRequestClose={() => setShowCambiosModal(null)}
                className="modal"
                overlayClassName="modal_overlay_modPerf"
                ariaHideApp={false}
              >
                {showCambiosModal !== null && (
                  <div>

                    <h2>Realice el cambio</h2>
                    <form onSubmit={(e) => {
                      e.preventDefault(); // evita recargar
                      saveUser(); // SOLO se ejecuta si el input es válido
                    }}>
                      <input
                        type={showCambiosModal}
                        value={nuevoContenido}
                        onChange={(e) => setNuevoContenido(e.target.value)}
                        className="input_field"
                        required
                      />
                      <label htmlFor=""> Modifique el campo</label>
                      <button
                        type="submit"
                        className="btn_modPerf"
                      >
                        Guardar <SaveIcon />
                      </button>
                      <button
                        className="btn_modPerf"
                        onClick={() => { setNuevoContenido(""); setShowCambiosModal(null); }}
                      >
                        Cerrar <DeleteIcon />
                      </button>
                    </form>


                  </div>
                )}

              </Modal>

            </div>
            {/*________________________________________________________________________________________________________________________*/}

            <div className="div-funciones">
              <h3>Funciones Especiales</h3>

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
              {errorGuardado && <div className="global-error">{errorGuardado}</div>}
              {guardadoExitoso && <div className="global-success">{guardadoExitoso}</div>}
            </div>

          </div>

        </div>
      )}

      <div className="sepa">
        <button className="btn_modPerf2" style={{ marginTop: 40 }} onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <button className="btn_modPerf2" style={{ marginTop: 40 }} onClick={handleSaveAll}>
          Guardar cambios
        </button>

      </div>

    </section>

  )


}