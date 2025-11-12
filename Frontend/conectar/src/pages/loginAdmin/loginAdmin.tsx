import { useRef, useState, useEffect, type FormEvent } from "react";
import StandardInput from "../../components/form/Form.tsx";
import { Button } from "../../components/button/Button.tsx";
import CheckIcon from "@mui/icons-material/Check";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from "react-router-dom";
import "./loginAdmin.css";
//import { useUser } from "../../Hooks/useUser.tsx";
import { useAdmin } from "../../Hooks/useAdmin.tsx";

export default function LoginAdmin() {
  const [admin, setAdmin] = useState<string>("");
  const [clave, setClave] = useState<string>("");

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPsw, setShowPsw] = useState(false);
  const Navigate = useNavigate();
  const errorTimerRef = useRef<number | null>(null);

  const { refreshAdmin } = useAdmin()
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


  const onChangeStr =
    (setter: (v: string) => void) =>
      (v: any) => {
        if (typeof v === "string") setter(v);
        else if (v?.target?.value !== undefined) setter(v.target.value as string);
      };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validaciones simples
    if (!admin || !clave) {
      showError("⚠️ Por favor, completá email y contraseña.");
      return;
    }
    if (!admin.toLowerCase().endsWith("@gmail.com")) {
      showError("⚠️ Usá un correo @gmail.com");
      return;
    }
    setError("");
    setLoading(true);

    const controller = new AbortController();
    const abortTimeout = window.setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch("http://localhost:3000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: admin.trim().toLowerCase(),
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
        showError(data?.error || "Admin email o contraseña incorrecta", 5000);
        setLoading(false);
        return;
      }

      setLoading(false);

      // Verificar sesión con /me
      try {
        await refreshAdmin(); // espera que el provider haga fetch /me
      } catch {
        // si refresh falla, no navegamos
        showError("No se pudo verificar sesión después del login");
        setLoading(false);
        return;
      }

      Navigate('/dashboard');

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
      <img src="../assets/conect_1.png" alt="Logo" style={{ height: '150px', cursor: 'pointer' }} onClick={() => Navigate("/")} />
      <div className="card">
        <form onSubmit={handleLogin}>
          <div className="card-header">
            <span className="card-title">INICIE SESIÓN</span>
          </div>

          <div className="card-content">
            <StandardInput
              label="admin"
              type="email"
              value={admin}
              autoComplete="username"
              onChange={onChangeStr(setAdmin)}
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

          <div className="card-actions">
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