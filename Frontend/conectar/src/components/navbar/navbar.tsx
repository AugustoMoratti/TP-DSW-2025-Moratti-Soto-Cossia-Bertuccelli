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
        <img src={logo} alt="Conetar Logo" className="logo" />
      </div>

      <ul className="nav_links">
        <li>Home</li>
        <li>About</li>
        <li>Resources ▾</li>
        <li>Contact</li>
      </ul>

      <div className="nav_buttons">
        <Button variant="contained" onClick={() => Navigate("/register")}>Register</Button>
        <Button variant="outlined" onClick={() => Navigate("/login")}>Login</Button>
      </div>
    </nav>
  );
};

export default Navbar;
