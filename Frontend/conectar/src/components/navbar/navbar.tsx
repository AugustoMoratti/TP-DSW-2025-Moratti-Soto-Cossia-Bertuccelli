import React from "react";
import logo from "../../../assets/conect.png";
import { Button } from "../button/Button";
import { useNavigate } from "react-router";
import "./navbar.css";

const Navbar: React.FC = () => {
  const Navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="logo_container">
        <img src={logo} alt="Conetar Logo" style={{ height: '100px' }} />
      </div>

    <div className="right_section">
      <ul className="nav_links">
        <Button onClick= {() => Navigate ("/contact")}>Contacto</Button>
      </ul>

        <div className="nav_buttons">
          <Button variant="contained" onClick={() => Navigate("/register")}>Register</Button>
          <Button variant="outlined" onClick={() => Navigate("/login")}>Login</Button>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
