import React, { useState } from "react";
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
}) => (
  <button
    className={`custom-btn ${variant === "outlined" ? "outlined" : "contained"}`}
    {...props}
  >
    <span>{children}</span>
    {icon && <span className="btn-icon end">{icon}</span>}
  </button>
);
