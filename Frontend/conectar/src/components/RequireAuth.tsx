import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
// revizar 
export default function RequireAuth({ children }: { children: JSX.Element }) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:3000/api/usuario/me", {
          credentials: "include",
        });
        setIsAuth(res.ok);
      } catch {
        setIsAuth(false);
      }
    })();
  }, []);

  if (isAuth === null) return <div>Cargando...</div>;
  if (!isAuth) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
