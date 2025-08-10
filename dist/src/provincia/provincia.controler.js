import { Provincia } from './provincia.entity.js';
import { orm } from '../../DB/orm.js';
const em = orm.em;
function sanitizeProvinciaInput(req, res, next) {
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        estado: req.body.estado,
    };
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
async function findAll(req, res) {
    try {
        const provincia = await em.find(Provincia, {});
        res.status(200).json({ message: 'found all Provincia', data: provincia });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const provincia = await em.findOneOrFail(Provincia, { id });
        res.status(200).json({ message: 'found provincia', data: provincia });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function add(req, res) {
    try {
        const provincia = em.create(Provincia, req.body.sanitizedInput);
        await em.flush();
        res.status(201).json({ message: 'provincia created', data: provincia });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const provinciaToUpdate = await em.findOneOrFail(Provincia, { id });
        em.assign(provinciaToUpdate, req.body.sanitizedInput);
        await em.flush();
        res
            .status(200)
            .json({ message: 'provincia updated', data: provinciaToUpdate });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const provincia = em.getReference(Provincia, id);
        await em.removeAndFlush(provincia);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizeProvinciaInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=provincia.controler.js.map