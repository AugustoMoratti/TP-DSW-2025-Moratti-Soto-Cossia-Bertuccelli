import { ProvinciaRepository } from './provincia.repository.js';
import { Provincia } from './provincia.entity.js';
const repository = new ProvinciaRepository();
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
function findAll(req, res) {
    res.json({ data: repository.findAll() });
}
function findOne(req, res) {
    const id = req.params.id;
    const provincia = repository.findOne({ id });
    if (!provincia) {
        res.status(404).send({ message: 'La provincia no se encontro' });
        return;
    }
    res.json({ data: provincia });
}
function add(req, res) {
    const input = req.body.sanitizedInput;
    const provinciaInput = new Provincia(input.nombre, input.estado);
    const provincia = repository.add(provinciaInput);
    if (provincia) {
        res.status(201).send({ message: 'Provincia creada', data: provincia });
        return;
    }
    else {
        res.status(404).send({ message: 'Provincia ya existente' });
        return;
    }
}
function update(req, res) {
    req.body.sanitizedInput.id = req.params.id;
    const provincia = repository.update(req.body.sanitizedInput);
    if (!provincia) {
        res.status(404).send({ message: 'La provincia no se encontro' });
        return;
    }
    res.status(200).send({ message: 'Provincia actualizada correctamente', data: provincia });
}
function remove(req, res) {
    const id = req.params.id;
    const provincia = repository.delete({ id });
    if (!provincia) {
        res.status(404).send({ message: 'La provincia no se encontro' });
    }
    else {
        res.status(200).send({ message: 'Provincia borrada correctamente' });
    }
}
export { sanitizeProvinciaInput, findAll, findOne, add, update, remove };
//PONER LOS RETURN DE LOS MENSAJEs
//# sourceMappingURL=provincia.controler.js.map