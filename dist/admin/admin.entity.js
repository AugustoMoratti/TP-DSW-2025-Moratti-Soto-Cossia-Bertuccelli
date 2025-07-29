import crypto from 'node:crypto';
export class administrador {
    constructor(user, clave, estado, idAdmin = crypto.randomUUID()) {
        this.user = user;
        this.clave = clave;
        this.estado = estado;
        this.idAdmin = idAdmin;
    }
}
//# sourceMappingURL=admin.entity.js.map