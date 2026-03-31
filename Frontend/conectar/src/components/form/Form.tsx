import React, { useState } from "react";
import "./Form.css";

interface StandardInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  disabled?: boolean;
}

const StandardInput: React.FC<StandardInputProps> = ({
  label,
  value,
  onChange,
  type,
  autoComplete,
  disabled,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="input_container">
      {/* Label flotante como ya tenías: sube con focus o si hay valor */}
      <label className={`input_label ${focused || value ? " floating" : ""}`}>
        {label}
      </label>

      <input
        type={type || "text"}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className={`input_field ${type === "date" ? "input_date" : ""}`}
        required={type === "date"}            /* 👈 clave para que :valid funcione */
        disabled={disabled}
      />
    </div>
  );
};

export default StandardInput;