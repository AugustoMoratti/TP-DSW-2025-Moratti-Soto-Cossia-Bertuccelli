import { UsuarioRepository } from './usuario.repository.js';
import { Usuario } from './usuario.entity.js';
import { LocalidadRepository } from '../localidad/localidad.repository.js'; // IMPORTARLO
const localidadRepo = new LocalidadRepository();
const repository = new UsuarioRepository();
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
function findAll(req, res) {
    res.json({ data: repository.findAll() });
}
function findOne(req, res) {
    const id = req.params.id;
    const usuario = repository.findOne({ id });
    if (!usuario) {
        res.status(404).send({ message: 'El usuario no se encontró' });
        return;
    }
    res.json({ data: usuario });
}
function add(req, res) {
    const input = req.body.sanitizedInput;
    const localidadExiste = localidadRepo.findOne({ id: input.codigoPostal }); // el input.localidad contiene el código postal
    if (!localidadExiste) {
        return res.status(404).send({ message: 'El código postal ingresado no corresponde a una localidad registrada' });
    }
    const usuarioInput = new Usuario(input.nombre, input.apellido, input.clave, input.email, input.descripcion, input.contacto, input.codigoPostal);
    const usuario = repository.add(usuarioInput);
    if (usuario) {
        res.status(201).send({ message: 'Usuario creado', data: usuario });
        return;
    }
    else {
        res.status(404).send({ message: 'Usuario ya existente' });
        return;
    }
}
function update(req, res) {
    req.body.sanitizedInput.id = req.params.id;
    const usuarioActual = repository.findOne({ id: req.body.sanitizedInput.id });
    if (!usuarioActual) {
        return res.status(404).send({ message: 'Usuario no encontrado' });
    }
    // Si se intenta modificar el codigoPostal, verificar que exista en localidades
    if (req.body.sanitizedInput.codigoPostal && req.body.sanitizedInput.codigoPostal !== usuarioActual.codigoPostal) {
        if (!localidadRepo.findOne({ id: req.body.sanitizedInput.codigoPostal })) {
            return res.status(400).send({ message: 'La nueva localidad no existe, no se pudo actualizar el usuario' });
        }
    }
    const usuarioActualizado = repository.update(req.body.sanitizedInput);
    return res.status(200).send({ message: 'Usuario actualizado correctamente', data: usuarioActualizado });
}
function remove(req, res) {
    const id = req.params.id;
    const usuario = repository.delete({ id });
    if (!usuario) {
        res.status(404).send({ message: 'El usuario no se encontro' });
    }
    else {
        res.status(200).send({ message: 'Usuario borrado correctamente' });
    }
}
export { sanitizeUsuarioInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=usuario.controler.js.map