import crypto from 'crypto';

export class Trabajo {
    constructor(
        public id = crypto.randomUUID(),
        public estado = true,
        public fecha_solicitud: string,
        public fecha_realizado: string,
        public montoTotal: number,
    ) { }
} //REVISAR DEPENDENCIAS Y DATOS