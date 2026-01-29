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

export default function EditProfile2() {
  const navigate = useNavigate()
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false)
  const [showClavesModal, setShowClavesModal] = useState(false);
  const [showProfModal, setShowProfModal] = useState(false);
  const [showHabiModal, setShowHabiModal] = useState(false);
  const [pestaña, setPestaña] = useState(false);
  const [clave, setClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");

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
  console.log(user)

  const handleSaveAll = async () => {

  };



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
        <div className="card-container-single-card">

          <div className="card-header">
            <span className="card-title">Mi Perfil</span>
          </div>

          <div className="card-content profile-grid-single">

            <div className="div-imagen">
              <div className="field-with-action">
                <img
                  src={user?.fotoUrl ? `http://localhost:3000${user.fotoUrl}` : ""}
                  alt="Foto de perfil"
                  className="profile-image"
                />
                <button
                  type="button"
                  className="btn_modPerf editar-btn"
                //onClick={() => toggleEdit(field)}
                >
                  Editar Imagen
                </button>
              </div>

            </div>

            <div className="div-contacto">

              <h3>Datos de Contacto</h3>

              <div className="field-with-action">
                <p>Telefono</p>
                <p >{user.contacto}</p>
                <button
                  type="button"
                  className="btn_modPerf editar-btn"
                //onClick={() => toggleEdit(field)}
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
                //onClick={() => toggleEdit(field)}
                >
                  Editar <EditIcon />
                </button>
              </div>

            </div>


            <div className="div-ubicacion">

              <h3>Ubicacion</h3>

              <div className="field-with-action">
                <p>Localidad</p>
                <p>{user.localidad.nombre}</p>
                <button
                  type="button"
                  className="btn_modPerf editar-btn"
                //onClick={() => toggleEdit(field)}
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
                //onClick={() => toggleEdit(field)}
                >
                  Editar <EditIcon />
                </button>
              </div>

            </div>

            <div className="div-datos-personales">

              <h3>Datos Personales</h3>

              <div className="field-with-action">
                <p>Nombre</p>
                <p>{user.nombre}</p>
                <button
                  type="button"
                  className="btn_modPerf editar-btn"
                //onClick={() => toggleEdit(field)}
                >
                  Editar <EditIcon />
                </button>
              </div>

              <div className="field-with-action">
                <p>Apellido</p>
                <p>{user.apellido}</p>
                <button
                  type="button"
                  className="btn_modPerf editar-btn"
                //onClick={() => toggleEdit(field)}
                >
                  Editar <EditIcon />
                </button>
              </div>

              <div className="field-with-action">
                <p>Fecha de Nacimiento</p>
                <p>{user.fechaNac}</p>
                <button
                  type="button"
                  className="btn_modPerf editar-btn"
                //onClick={() => toggleEdit(field)}
                >
                  Editar <EditIcon />
                </button>
              </div>

            </div>

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

          </div>

          <button className="btn_modPerf" style={{ marginTop: 40 }} onClick={() => navigate(-1)}>
            ← Volver
          </button>

          <div className="btn_modPerf">
            <button>Guardar cambios</button>
          </div>

        </div>
      )}

    </section>

  )


}