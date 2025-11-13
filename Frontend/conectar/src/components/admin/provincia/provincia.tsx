import AddProv from "./addProv.tsx";
import RmProv from './rmProv.tsx'
import "./provincia.css";

export default function Provincias() {

  return (
    <>
      <div>
        <AddProv/>
      </div>

      <div className="divisor"></div>

      <div>
        <RmProv/>
      </div>
      </>
  );
};