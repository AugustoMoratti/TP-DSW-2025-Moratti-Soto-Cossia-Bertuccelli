import { useState, useEffect } from "react";
import { getCookie, setCookie, deleteCookie } from "../utils/cookies";

export interface LoginAttemps {
  count: number;
  blockedUntil: number | null;
  isBlocked: boolean;
  timeRemaining: number; // segundos restantes
}

const MAX_ATTEMPTS = 3;
const BLOCK_TIME = 60 * 1000; // 1 minuto en milisegundos
const COOKIE_NAME = "loginAttempts";

export function useLoginAttempts() {
  const [attempts, setAttempts] = useState<LoginAttemps>({
    count: 0,
    blockedUntil: null,
    isBlocked: false,
    timeRemaining: 0,
  });

  // Inicializar desde cookies y actualizar bloqueo cada segundo
  useEffect(() => {
    const loadAttemptsFromCookie = () => {
      const cookie = getCookie(COOKIE_NAME);
      if (!cookie) {
        setAttempts({
          count: 0,
          blockedUntil: null,
          isBlocked: false,
          timeRemaining: 0,
        });
        return;
      }

      try {
        const stored = JSON.parse(cookie);
        const now = Date.now();
        const blockedUntil = stored.blockedUntil;
        const isBlocked = blockedUntil && now < blockedUntil;
        const timeRemaining = isBlocked
          ? Math.ceil((blockedUntil - now) / 1000)
          : 0;

        setAttempts({
          count: stored.count || 0,
          blockedUntil: blockedUntil || null,
          isBlocked: !!isBlocked,
          timeRemaining,
        });

        // Si el bloqueo expiró, limpiar la cookie
        if (!isBlocked && blockedUntil) {
          deleteCookie(COOKIE_NAME);
        }
      } catch (e) {
        console.error("Error al parsear cookie de intentos:", e);
        deleteCookie(COOKIE_NAME);
      }
    };

    loadAttemptsFromCookie();

    // Actualizar cada segundo para mostrar tiempo restante
    const interval = setInterval(loadAttemptsFromCookie, 1000);
    return () => clearInterval(interval);
  }, []);

  const recordFailedAttempt = () => {
    const now = Date.now();
    const newCount = (attempts.count || 0) + 1;
    let blockedUntil = attempts.blockedUntil;

    // Si alcanzó el máximo de intentos, bloquear
    if (newCount >= MAX_ATTEMPTS) {
      blockedUntil = now + BLOCK_TIME;
    }

    const newState = {
      count: newCount,
      blockedUntil,
      isBlocked: newCount >= MAX_ATTEMPTS,
      timeRemaining: newCount >= MAX_ATTEMPTS
        ? Math.ceil(BLOCK_TIME / 1000)
        : 0,
    };

    setCookie(COOKIE_NAME, JSON.stringify(newState), 1, {
      sameSite: "Lax",
      secure: window.location.protocol === "https:",
    });

    setAttempts(newState);
  };

  const resetAttempts = () => {
    deleteCookie(COOKIE_NAME);
    setAttempts({
      count: 0,
      blockedUntil: null,
      isBlocked: false,
      timeRemaining: 0,
    });
  };

  const getAttempsRemaining = () => {
    if (attempts.isBlocked) return 0;
    return Math.max(0, MAX_ATTEMPTS - (attempts.count || 0));
  };

  return {
    attempts,
    recordFailedAttempt,
    resetAttempts,
    getAttempsRemaining,
  };
}
