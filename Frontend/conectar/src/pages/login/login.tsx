import { useRef, useState, useEffect, type FormEvent } from "react";
import StandardInput from "../../components/form/Form.tsx";
import { Button } from "../../components/button/Button.tsx";
import CheckIcon from "@mui/icons-material/Check";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from "react-router-dom";
import { getCookie, setCookie, deleteCookie } from "../../utils/cookies.ts";
import "./login.css";

export default function Login() {
  const [usuario, setUsuario] = useState<string>("");
  const [clave, setClave] = useState<string>("");
  const [recuerdame, setRecuerdame] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPsw, setShowPsw] = useState(false);
  const navigate = useNavigate();
  const errorTimerRef = useRef<number | null>(null);

  // cleanup on unmount: limpiar timers
  useEffect(() => {
    return () => {
      if (errorTimerRef.current) window.clearTimeout(errorTimerRef.current);
    };
  }, []);

  const showError = (msg: string, ms = 5000) => {
    // limpia timer anterior si existe
    if (errorTimerRef.current) {
      window.clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }

    setError(msg);

    // autoocultar error después de ms
    errorTimerRef.current = window.setTimeout(() => {
      setError("");
      errorTimerRef.current = null;
    }, ms);
  };

  useEffect(() => {
    const savedUser = getCookie("usuario");
    const savedRecuerdame = getCookie("recuerdame") === "true";
    if (savedRecuerdame && savedUser) {
      setUsuario(savedUser);
      setRecuerdame(true);
    } else {
      // limpiar cualquier cookie usuario suelta si no está marcado
      deleteCookie("usuario");
      setUsuario("");
      setRecuerdame(false);
    }
  }, []);


  const onChangeStr =
    (setter: (v: string) => void) =>
      (v: any) => {
        if (typeof v === "string") setter(v);
        else if (v?.target?.value !== undefined) setter(v.target.value as string);
      };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (recuerdame) {
      setCookie("usuario", usuario, 30, {
        sameSite: "Lax",
        secure: window.location.protocol === "https:", // true si estás en HTTPS
      });

      setCookie("recuerdame", "true", 30, {
        sameSite: "Lax",
        secure: window.location.protocol === "https:",
      });
    } else {
      deleteCookie("usuario");
      deleteCookie("recuerdame");
    }


    // Validaciones simples
    if (!usuario || !clave) {
      showError("⚠️ Por favor, completá email y contraseña.");
      return;
    }
    if (!usuario.toLowerCase().endsWith("@gmail.com")) {
      showError("⚠️ Usá un correo @gmail.com");
      return;
    }
    setError("");
    setLoading(true);

    const controller = new AbortController();
    const abortTimeout = window.setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch("http://localhost:3000/api/usuario/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: usuario.trim().toLowerCase(),
          clave,
        }),
        signal: controller.signal,
      });

      // consumir JSON solo una vez
      let data: any = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        // mostrar error y permitir reintento
        showError(data?.error || "Usuario o contraseña incorrecta", 5000);
        setLoading(false);
        return;
      }

      console.log("Logueado Correctamente:", data);
      setLoading(false);
      // Verificar sesión con /me
      navigate(`/perfil`);

    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        showError("⏱️ Tiempo de espera agotado. Inténtalo de nuevo.", 5000);
      } else {
        showError("⚠️ Error de conexión con el servidor.", 5000);
      }
      setLoading(false);
    } finally {
      // limpiar timeout de abort si quedó
      window.clearTimeout(abortTimeout);
    }
  };

  return (
    <section className="main-bg">
      <img src="../assets/conect_1.png" alt="Logo" className='logo_login' />
      <div className="card">
        <form onSubmit={handleLogin}>
          <div className="card-header">
            <span className="card-title">INICIE SESIÓN</span>
          </div>

          <div className="card-content">
            <StandardInput
              label="Usuario"
              value={usuario}
              autoComplete="username"
              onChange={onChangeStr(setUsuario)}
            />
            <div className="password-container">
              <StandardInput
                label="Clave"
                type={showPsw ? "text" : "password"}
                value={clave}
                autoComplete="current-password"
                onChange={onChangeStr(setClave)}
              />
              {showPsw ? (
                <VisibilityIcon className="psw-icon" onClick={() => setShowPsw(false)} />
              ) : (
                <VisibilityOffIcon className="psw-icon" onClick={() => setShowPsw(true)} />
              )}
            </div>
          </div>

            <div className="recuerdame-container">
              <input
                type="checkbox"
                id="recuerdame"
                checked={recuerdame}
                onChange={() => setRecuerdame((v) => !v)}
              />
              <label htmlFor="recuerdame">Recuérdame</label>
            </div>

            <div className="card-actions">
              <button
                className="cta-link"
                type="button"
                onClick={() => navigate("/register")}
              >
                ¿No tiene cuenta? Cree una ahora mismo
              </button>

              <Button
                type="submit"
                variant="contained"
                icon={<CheckIcon />}
                disabled={loading}
              >
                {loading ? "Ingresando..." : "Enviar"}
              </Button>

              {error && (
                <div
                  style={{ color: "red", marginTop: 10, textAlign: "center" }}
                >
                  {error}
                </div>
              )}
            </div>
        </form>
      </div>
    </section>
  );
};