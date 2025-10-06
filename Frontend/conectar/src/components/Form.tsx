import "./Form.css";
import React, { useState } from "react";

interface StandardInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

const StandardInput: React.FC<StandardInputProps> = ({
  label,
  value,
  onChange,
  type = "text",
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="input-container">
      <label
        className={`input-label${focused || value ? " floating" : ""}`}
      >
        {label}
      </label>
      <input
        type={type}
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
