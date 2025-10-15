import "./header.css";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";

type HeaderProps = {
  children?: ReactNode;
  bgColor?: string;        //Color
  logoSrc?: string;        //Logo
};

export default function Header({
  children,
  bgColor = "#114f5a",     //Valor por defecto
  logoSrc = "/assets/conect_1.png",  //Valor por defecto
}: HeaderProps) {

  const Navigate = useNavigate();

  return (
    <header className="header" style={{ backgroundColor: bgColor }}>
      <div className="header-container" onClick={() => Navigate("/")}>
        <img src={logoSrc} alt="Logo" className="logo" />
        <nav className="header-btns">
          {children}
        </nav>
      </div>
    </header>
  );
}
