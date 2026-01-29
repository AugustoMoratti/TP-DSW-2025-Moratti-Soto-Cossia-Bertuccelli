import "./userCard.css";

interface Props {
  small?: boolean;
}

export default function UserCard ({ small }: Props) {
  return (
    <div className={`user-card ${small ? "small" : ""}`}>
      <div className="avatarr" />
      <div className="user-infoo">
        <h4>Apellido, Nombre</h4>
        <p>Localidad, Provincia</p>
        {!small && <span>Profesiones</span>}
      </div>
    </div>
  );
};
//cambiar h4, p y span cuando se conecte con el back

