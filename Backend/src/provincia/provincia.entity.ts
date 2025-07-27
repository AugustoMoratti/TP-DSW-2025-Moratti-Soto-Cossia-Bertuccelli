import crypto from 'node:crypto'

export class Provincia {
  constructor(
    public nombre: string,
    public estado: boolean,
    public id = crypto.randomUUID()
  ) { }
}