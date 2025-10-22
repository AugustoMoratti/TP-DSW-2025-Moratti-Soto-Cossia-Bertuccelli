import React from "react";
import logo from "../../../assets/conect_2_1.png";
import { Button } from "../button/Button";
import { useNavigate } from "react-router";
import "./navbar.css";

const Navbar: React.FC = () => {
  const Navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="logo_container">
        <img src={logo} alt="Conectar Logo" />
      </div>
      <div className="right_section">
          <Button onClick={() => Navigate("/contact")}>
            Contacto
          </Button>
        <div className="nav_buttons">
          <Button variant="contained" onClick={() => Navigate("/register")}>
            Register
          </Button>
          <Button variant="contained" onClick={() => Navigate("/login")}>
            Login
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
