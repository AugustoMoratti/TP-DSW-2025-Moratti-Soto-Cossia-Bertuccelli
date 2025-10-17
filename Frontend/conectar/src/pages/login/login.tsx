import { useState, useEffect, type FormEvent } from "react";
import StandardInput from "../../components/form/Form.tsx";
import { Button } from "../../components/button/Button.tsx";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import { getCookie, setCookie, deleteCookie } from "../../utils/cookies.ts";
import "./login.css";

export default function Login() {
  const [usuario, setUsuario] = useState<string>("");
  const [clave, setClave] = useState<string>("");
  const [recuerdame, setRecuerdame] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();


useEffect(() => {
  const savedUser = getCookie("usuario");
  const savedRecuerdame = getCookie("recuerdame") === "true";
  if (savedRecuerdame && savedUser) {
    setUsuario(savedUser);
    setRecuerdame(true);
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


    // Validaciones
    if (!usuario || !clave) {
      setError("⚠️ Por favor, completá email y contraseña.");
      return;
    }
    if (!usuario.toLowerCase().endsWith("@gmail.com")) {
      setError("⚠️ Usá un correo @gmail.com");
      return;
    }

    setError("");
    setLoading(true);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000);

    try {
      const res = await fetch("http://localhost:3000/api/usuario/login", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        credentials: "include", // cookie HttpOnly
        body: JSON.stringify({
          email: usuario.trim().toLowerCase(),
          clave,
        }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {}

      if (!res.ok) {
        setError(data?.error || data?.message || "❌ Error en el login.");
        return;
      }

      // Verificar sesión con /me
      try {
        await fetch("http://localhost:3000/api/usuario/me", {
          credentials: "include",
        });
      } catch {}

      navigate("/busqProfesionales");

      } catch (err: any) {
        if (err?.name === 'AbortError') {
          setError('⏱️ Tiempo de espera agotado. Intentalo de nuevo.');
        } else {
          setError('⚠️ Error de conexión con el servidor.');
        }
      } finally {
        clearTimeout(timeout);
      }
          setLoading(false);
  };

  return (
    <section className="main-bg">
      <img src="../assets/conect_1.png" alt="Logo" className='logo' />
      <div className="card">
        <form onSubmit={handleLogin}>
          <div className="card-header">
            <span className="card-title">INICIE SESIÓN</span>
          </div>

          <div className="card-content">
            <StandardInput
              label="Usuario"
              value={usuario}
              onChange={onChangeStr(setUsuario)}
            />
            <StandardInput
              label="Clave"
              type="password"
              value={clave}
              onChange={onChangeStr(setClave)}
            />

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
          </div>
        </form>
      </div>
    </section>
  );
}
``