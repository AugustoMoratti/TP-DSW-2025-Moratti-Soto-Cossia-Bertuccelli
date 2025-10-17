import React, { useId, useState } from "react";
import "./Form.css";

interface StandardInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  name?: string;
  autoComplete?: string;
}

const StandardInput: React.FC<StandardInputProps> = ({
  label,
  value,
  onChange,
  type = "text",
  name,
  autoComplete,
}) => {
  const reactId = useId(); 
  const id = `${name || label.replace(/\s+/g, "-").toLowerCase()}-${reactId}`;
  const [focused, setFocused] = useState(false);

  const isFloating = focused || (value ?? "").length > 0;

  return (
    <div className="input_container">
      <label htmlFor={id} className={`input_label ${isFloating ? "floating" : ""}`}>
        {label}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder=" "                 // Reserva altura para el label
        autoComplete={autoComplete}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        className={`input_field ${type === "date" ? "input_date" : ""}`}
      />
    </div>
  );
};

export default StandardInput;