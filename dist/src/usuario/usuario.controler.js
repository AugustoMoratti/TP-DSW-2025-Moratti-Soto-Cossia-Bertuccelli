import { Usuario } from './usuario.entity.js';
import { orm } from '../../DB/orm.js';
const em = orm.em;
function sanitizeUsuarioInput(req, res, next) {
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        clave: req.body.clave,
        email: req.body.email,
        descripcion: req.body.descripcion,
        contacto: req.body.contacto,
        codigoPostal: req.body.codigoPostal,
    };
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    /*Recordar modificar esta porcion de codigo en todos los crud, ya que esto nos sirve
    para corrobar campos obligatorios y no ignorar si son undefined sino pedirlos si o si*/
    next();
}
async function findAll(req, res) {
    try {
        const usuarios = await em.find(Usuario, {});
        res
            .status(200)
            .json({ message: 'found all Usuarios', data: usuarios });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const usuario = await em.findOneOrFail(Usuario, { id });
        res
            .status(200)
            .json({ message: 'found Usuario', data: usuario });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function add(req, res) {
    try {
        const usuario = em.create(Usuario, req.body);
        await em.flush();
        res
            .status(201)
            .json({ message: 'Usuario class created', data: usuario });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const usuario = em.getReference(Usuario, id);
        em.assign(usuario, req.body);
        await em.flush();
        res.status(200).json({ message: 'Usuario class updated' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const usuario = em.getReference(Usuario, id);
        await em.removeAndFlush(Usuario);
        res.status(200).send({ message: 'Usuario deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizeUsuarioInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=usuario.controler.js.map