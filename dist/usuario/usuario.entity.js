import crypto from 'node:crypto';
export class Usuario {
    constructor(nombre, apellido, clave, email, descripcion, contacto, codigoPostal, id = crypto.randomUUID()) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.clave = clave;
        this.email = email;
        this.descripcion = descripcion;
        this.contacto = contacto;
        this.codigoPostal = codigoPostal;
        this.id = id;
    }
}
//# sourceMappingURL=usuario.entity.js.map