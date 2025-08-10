import { administrador } from './admin.entity.js';
const administradores = [
    new administrador('adminMain', '1234', true, 'a02b91bc-3769-4221-beb1-d7a3aeba7dad')
];
export class administradorRepository {
    findAll() {
        return administradores;
    }
    findOne(item) {
        return administradores.find((administrador) => administrador.idAdmin === item.id);
    }
    add(item) {
        const adm = administradores.find((administrador) => administrador.user === item.user);
        if (!adm) {
            administradores.push(item);
            return item;
        }
        else {
            return;
        }
    }
    update(item) {
        const administradorIdx = administradores.findIndex((administrador) => administrador.idAdmin === item.idAdmin);
        if (administradorIdx !== -1) {
            administradores[administradorIdx] = { ...administradores[administradorIdx], ...item };
        }
        return administradores[administradorIdx];
    }
    delete(item) {
        const administradorIdx = administradores.findIndex((administrador) => administrador.idAdmin === item.id);
        if (administradorIdx !== -1) {
            administradores[administradorIdx].estado = false;
            const deletedAdmin = administradores[administradorIdx];
            return deletedAdmin;
        }
    }
}
//# sourceMappingURL=admin.respository.js.map