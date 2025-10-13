import "./header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <img src="../../assets/conect.png" alt="Logo conectar" className="logo" />
        <nav className="header-btns">
          <button className="header-btn">Mi Perfil</button>
          <button className="header-btn">Admin</button>
        </nav>
      </div>
    </header>

  )
};