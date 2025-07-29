import crypto from 'node:crypto'

export class administrador {
    constructor(
        public user: string,
        public clave: string,
        public estado: boolean,
        public idAdmin = crypto.randomUUID()
    ) { }
}