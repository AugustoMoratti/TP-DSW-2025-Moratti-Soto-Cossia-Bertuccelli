import React from "react";
import { useRef, useEffect } from "react";
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
}) => 
  (
    
  <button
    className={`custom_btn ${variant === "outlined" ? "outlined" : "contained"}`}
    {...props}
  >
    <span>{children}</span>
    {icon && <span className='btn_icon.end'>{icon}</span>}
  </button>
);
