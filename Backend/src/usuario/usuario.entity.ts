import crypto from 'node:crypto'


export class Usuario {
  constructor(
    public nombre: string,
    public apellido: string,
    public clave: string,
    public email: string,
    public descripcion: string,
    public contacto: number,
    public codigoPostal: string,
    public id = crypto.randomUUID()
  ) { }
}