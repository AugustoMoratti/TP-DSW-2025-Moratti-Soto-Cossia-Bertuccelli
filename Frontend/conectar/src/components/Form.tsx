import React, { useState } from "react";
import "./Button.css";
import "./Form.css";

interface StandardInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

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

// Componente StandardInput
const StandardInput: React.FC<StandardInputProps> = ({
  label,
  value,
  onChange,
  type,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="input-container">
      <label className={`input-label${focused || value ? " floating" : ""}`}>
        {label}
      </label>
      <input
        type={type || 'text'}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        className="input-field"
      />
    </div>
  );
};

export default StandardInput;