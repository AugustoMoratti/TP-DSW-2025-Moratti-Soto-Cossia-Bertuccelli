import crypto from 'crypto';

export class Trabajo {
    constructor(
        public id = crypto.randomUUID(),
        public estado = true,
        public montoTotal: number,
    ) { }
} //REVISAR DEPENDENCIAS Y DATOS