import crypto from 'crypto'

export class Profesion {
    constructor(
        public nombreProf: string,
        public descProf: string,
        public estado: boolean,
        public codProf = crypto.randomUUID()
    ) { }
}