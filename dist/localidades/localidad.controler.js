import { LocalicadRepository } from './localidad.repository.js';
import { Localidad } from './localidades.entity.js';
const repository = new LocalicadRepository();
function sanitizeLocalidadInput(req, res, next) {
    req.body.sanitizedInput = {
        codPostal: req.body.codPostal,
        nombre: req.body.nombre,
    };
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
function findAllLocalidad(req, res) {
    res.json({ data: repository.findAllLocalidad() });
}
function findOneLocalidad(req, res) {
    const id = req.params.id;
    const localidad = repository.findOneLocalidad({ id });
    if (!localidad) {
        return res.status(404).send({ message: 'No se encontro la localidad' });
    }
    res.json({ data: localidad });
}
function addLocalidad(req, res) {
    const input = req.body.sanitizedInput;
    const localidadInput = new Localidad(input.codPostal, input.nombre);
    const localidad = repository.addLocalidad(localidadInput);
    if (localidad) {
        return res.status(201).send({ message: 'La localidad fue creada con exito' });
    }
    else {
        return res.status(404).send({ message: 'La localidad ya existe' });
    }
}
function updateLocalidad(req, res) {
    req.body.sanitizedInput.id = req.params.id;
    const localidad = repository.updateLocalidad(req.body.sanitizedInput);
    if (!localidad) {
        return res.status(200).send({ message: 'La localidad se actualizo con exito' });
    }
    else {
        return res.status(404).send({ message: 'No se encontro la localidad' });
    }
}
function removeLocalidad(req, res) {
    const id = req.params.id;
    const localidad = repository.deleteLocalidad({ id });
    if (!localidad) {
        return res.status(200).send({ message: 'La localidad se elimino con exito:', data: localidad });
    }
    else {
        return res.status(404).send({ message: 'No se encontro la localidad' });
    }
}
export { sanitizeLocalidadInput, findAllLocalidad, findOneLocalidad, addLocalidad, updateLocalidad, removeLocalidad };
//# sourceMappingURL=localidad.controler.js.map