import "./header.css";
import type { ReactNode } from "react";

type HeaderProps = {
  children?: ReactNode;
};

export default function Header({ children }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-container">
        <img src="../../assets/conect_1.png" alt="Logo" className="logo" />
        <nav className="header-btns">
          {children}
        </nav>
      </div>
    </header>
  );
}