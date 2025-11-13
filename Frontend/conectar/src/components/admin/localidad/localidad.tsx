import AddLoc from "./AddLoc.tsx";
import RmLoc from './RmLoc.tsx'
import "./localidad.css";

export default function Provincias() {

  return (
    <>
      <div>
        <AddLoc/>
      </div>

      <div className="divisor"></div>

      <div>
        <RmLoc/>
      </div>
      </>
  );
};