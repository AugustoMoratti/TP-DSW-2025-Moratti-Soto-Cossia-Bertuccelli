import { animate } from "animejs/animation";
import "./header.css";
import { useEffect, useRef } from "react";
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
  
  const logoRef = useRef<HTMLImageElement | null>(null);


  useEffect(() => {
    const logoEl = logoRef.current;
    if (!logoEl) return;

    const handleEnter = () => {
      animate(logoEl, {
        scale: 1.15,
        duration: 300,
        ease: "out(3)",
      });
    };

    const handleLeave = () => {
      animate(logoEl, {
        scale: 1,
        duration: 300,
        ease: "out(3)",
      });
    };

    logoEl.addEventListener("mouseenter", handleEnter);
    logoEl.addEventListener("mouseleave", handleLeave);

    return () => {
      logoEl.removeEventListener("mouseenter", handleEnter);
      logoEl.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  const Navigate = useNavigate();

  return (
    <header className="header" style={{ backgroundColor: bgColor }}>
      <div className="header-container" >
        <img ref={logoRef} src={logoSrc} alt="Conectar Logo" className="logo_header" onClick={() => Navigate("/")} />
        <nav className="header-btns">
          {children}
        </nav>
      </div>
    </header>
  );
}
