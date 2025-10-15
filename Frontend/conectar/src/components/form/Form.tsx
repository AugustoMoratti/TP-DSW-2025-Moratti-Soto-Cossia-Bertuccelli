import React, { useState } from "react";
import styles from "./Form.css";

interface StandardInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

// Componente StandardInput
const StandardInput: React.FC<StandardInputProps> = ({
  label,
  value,
  onChange,
  type,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className={styles.input_container}>
      <label className={`${styles.input_label} ${focused || value ? " floating" : ""}`}>
        {label}
      </label>
      <input
        type={type || 'text'}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        className={styles.input_field}
      />
    </div>
  );
};

export default StandardInput;