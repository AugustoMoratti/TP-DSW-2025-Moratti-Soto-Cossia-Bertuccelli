import React, { useRef, useEffect } from "react";
import { animate } from "animejs";
import "./Button.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "contained" | "outlined";
  icon?: React.ReactNode;
}

// Componente Button
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "contained",
  icon,
  ...props
}) => {
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const btnEl = btnRef.current;
    if (!btnEl) return;

    const handleEnter = () => {
      animate(btnEl, {
        scale: 1.05,
        duration: 200,
        easing: "easeOutQuad",
      });
    };
    const handleLeave = () => {
      animate(btnEl, {
        scale: 1,
        duration: 200,
        easing: "easeOutQuad",
      });
    };

    btnEl.addEventListener("mouseenter", handleEnter);
    btnEl.addEventListener("mouseleave", handleLeave);
    btnEl.addEventListener("focus", handleEnter);
    btnEl.addEventListener("blur", handleLeave);

    return () => {
      btnEl.removeEventListener("mouseenter", handleEnter);
      btnEl.removeEventListener("mouseleave", handleLeave);
      btnEl.removeEventListener("focus", handleEnter);
      btnEl.removeEventListener("blur", handleLeave);
    };
  }, []);

  return (
    <button
      ref={btnRef}
      className={`custom_btn ${variant === "outlined" ? "outlined" : "contained"}`}
      {...props}
    >
      <span>{children}</span>
      {icon && <span className='btn_icon.end'>{icon}</span>}
    </button>
  );
};
