import { useRef, useState, useEffect, type FormEvent } from "react";
import StandardInput from "../../components/form/Form.tsx";
import { Button } from "../../components/button/Button.tsx";
import CheckIcon from "@mui/icons-material/Check";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from "react-router-dom";
import { getCookie, setCookie, deleteCookie } from "../../utils/cookies.ts";
import ErrorModal from "../../components/ErrorModal/ErrorModal.tsx";
import { useLoginAttempts } from "../../Hooks/useLoginAttempts.tsx";
import "./login.css";
import { useUser } from "../../Hooks/useUser.tsx";
import { animate } from "animejs/animation";

export default function Login() {
  const [usuario, setUsuario] = useState<string>("");
  const [clave, setClave] = useState<string>("");
  const [recuerdame, setRecuerdame] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPsw, setShowPsw] = useState(false);
  const Navigate = useNavigate();
  const errorTimerRef = useRef<number | null>(null);

  const { refreshUser } = useUser();
  const { attempts, recordFailedAttempt, resetAttempts, getAttempsRemaining } =
    useLoginAttempts();
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
    setErrorVisible(true);

    // autoocultar error después de ms
    errorTimerRef.current = window.setTimeout(() => {
      setErrorVisible(false);
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

    // Verificar si está bloqueado
    if (attempts.isBlocked) {
      showError(
        `Has intentado muchas veces. Intenta mas tarde.`,
        5000
      );
      return;
    }

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
        // Registrar intento fallido
        recordFailedAttempt();
        const attemptsRemaining = getAttempsRemaining();

        if (attemptsRemaining > 0) {
          showError(
            `${data?.error || "Usuario o contraseña incorrecta"}. `,
            5000
          );
        } else {
          showError(
            "Has agotado los 3 intentos. Intenta de nuevo en 1 minuto.",
            5000
          );
        }

        setLoading(false);
        return;
      }

      setLoading(false);

      // Login exitoso: limpiar intentos
      resetAttempts();

      // Verificar sesión con /me
      try {
        await refreshUser(); // espera que el provider haga fetch /me
      } catch {
        // si refresh falla, no navegamos
        showError("No se pudo verificar sesión después del login");
        setLoading(false);
        return;
      }

      Navigate('/perfil');
    } catch (err: unknown) {
      recordFailedAttempt();
      const attemptsRemaining = getAttempsRemaining();

      if (err instanceof DOMException && err.name === "AbortError") {
        showError("Tiempo de espera agotado. Inténtalo de nuevo.", 5000);
      } else {
        if (attemptsRemaining > 0) {
          showError(
            `⚠️ Error de conexión con el servidor. Intentos restantes: ${attemptsRemaining}`,
            5000
          );
        } else {
          showError(
            "❌ Has agotado los 3 intentos. Intenta de nuevo en 1 minuto.",
            5000
          );
        }
      }
      setLoading(false);
    } finally {
      // limpiar timeout de abort si quedó
      window.clearTimeout(abortTimeout);
    }
  };

      const handleEnter = () => {
      animate(".logo1", {
        scale: 1.15,
        duration: 300,
        ease: "out(3)",
      });
    };

    const handleLeave = () => {
      animate(".logo1", {
        scale: 1,
        duration: 300,
        ease: "out(3)",
      });
    };

  return (
    <section className="main-bg">
      <img src="../assets/conect_1.png" className="logo1" alt="Logo" style={{ height: '150px', cursor: 'pointer' }} onClick={() => Navigate("/")} onMouseEnter={handleEnter} onMouseLeave={handleLeave}/>
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
              disabled={attempts.isBlocked}
            />
            <div className="password-container">
              <StandardInput
                label="Clave"
                type={showPsw ? "text" : "password"}
                value={clave}
                autoComplete="current-password"
                onChange={onChangeStr(setClave)}
                disabled={attempts.isBlocked}
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
              disabled={attempts.isBlocked}
            />
            <label htmlFor="recuerdame">Recuérdame</label>
          </div>

          <div className="card-actions">
            <button
              className="cta-link"
              type="button"
              onClick={() => Navigate("/forgot-password")}
              disabled={attempts.isBlocked}
            >
              ¿Olvidaste tu contraseña?
            </button>

            <button
              className="cta-link"
              type="button"
              onClick={() => Navigate("/register")}
              disabled={attempts.isBlocked}
            >
              ¿No tiene cuenta? Cree una ahora mismo
            </button>
          </div>
          <div>
            <Button
              type="submit"
              className="btn-submit"
              variant="contained"
              icon={<CheckIcon />}
              disabled={loading || attempts.isBlocked}
            >
              {loading ? "Ingresando..." : attempts.isBlocked ? `Bloqueado (${attempts.timeRemaining}s)` : "Enviar"}
            </Button>
          </div>
        </form>
      </div>

      <ErrorModal
        message={error}
        isVisible={errorVisible}
        onClose={() => setErrorVisible(false)}
        duration={5000}
      />
    </section>
  );
};