import React, { useState } from "react";
import styles from "./Button.css";

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
    className={`${styles.custom_btn} ${variant === "outlined" ? "outlined" : "contained"}`}
    {...props}
  >
    <span>{children}</span>
    {icon && <span className={styles.btn_icon.end}>{icon}</span>}
  </button>
);
