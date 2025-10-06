import React from "react";
import "./Button.css";
//import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "contained" | "outlined";
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "contained",
  icon,
  ...props
}) => {
  return (
    <button
      className={`custom-btn ${variant === "outlined" ? "outlined" : "contained"}`}
      {...props}
    >
      <span>{children}</span>
      {icon && <span className="btn-icon end">{icon}</span>}
    </button>
  );
};

export default Button;