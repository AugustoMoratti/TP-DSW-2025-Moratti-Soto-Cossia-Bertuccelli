import { Request, Response, NextFunction } from 'express'
import { Posteo } from './post.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { orm } from '../../DB/orm.js';
import { HttpError } from '../types/HttpError.js';
import { Http } from '@mui/icons-material';



//terminado
function sanitizePosteoInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    user: req.body.user,
    texto: req.body.texto,
    imagenUrl: req.body.imagenUrl,
    fechaCreacion: req.body.fechaCreacion
  }
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

//terminado
async function findAll(req: Request, res: Response, next: NextFunction) {
  const em = orm.em.fork();

  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;

    const [posteos, total] = await em.findAndCount(
      Posteo,
      {},
      {
        orderBy: { fechaCreacion: 'DESC' },
        limit,
        offset: (page - 1) * limit
      }
    )

    if (posteos.length > 0) {
      res
        .status(200)
        .json({ message: 'Posteos encontrados', data: posteos })
    } else {
      res
        .status(200)
        .json({ message: 'No hay posteos aun', data: posteos })
    }
  } catch (error: any) {
    next(error)
  }
}

//Terminado
async function findOne(req: Request, res: Response, next: NextFunction) {
  const em = orm.em.fork();

  try {
    const id = req.params.id
    const post = await em.findOne(Posteo, { id })
    if (!post) {
      throw new HttpError(404, 'NOT_FOUND', 'Posteo no encontrado')
    }
    res
      .status(200)
      .json({ message: 'Posteo encontrado', data: post })
  } catch (error: any) {
    next(error)
  }
}

//Terminado
async function findAllForUser(req: Request, res: Response, next: NextFunction) {
  const em = orm.em.fork();

  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const email = req.params.emailUser

    const user = await em.findOne(Usuario, { email })
    if (!user) {
      throw new HttpError(404, 'NOT_FOUND', 'Usuario no encontrado')
    }

    const posteos = await em.findAndCount(Posteo, { user }, { populate: ['user'], limit, offset: (page - 1) * limit })
    if (posteos.length > 0) {
      res
        .status(200)
        .json({ message: 'Posteos del usuario', data: posteos })
    } else {
      res
        .status(200)
        .json({ message: 'El usuario no tiene posteos aun', data: posteos })
    }
  } catch (error: any) {
    next(error)
  }
}


async function add(req: Request, res: Response, next: NextFunction) {
  const em = orm.em.fork();

  try {
    const { idUser, texto, imagenUrl } = req.body.sanitizedInput

    if (typeof idUser !== 'string') {
      throw new HttpError(400, 'INVALID_INPUT', 'El id del usuario debe ser un string')
    }
    if (typeof imagenUrl !== 'string') {
      throw new HttpError(400, 'INVALID_INPUT', 'La url de la imagen debe ser un string')
    }
    const id = idUser
    const user = em.getReference(Usuario, id)
    //Uso getReference porque el id sera enviado desde el front utilizando las cookies, no hay forma que no exista

    if (typeof texto !== 'string' || texto === "") {
      throw new HttpError(400, 'INVALID_INPUT', 'El texto del post es obligatorio y debe ser un string')
    }

    const post = new Posteo()
    post.texto = texto
    post.user = user
    if (imagenUrl !== '') post.imagenUrl = imagenUrl

    em.persist(post)
    await em.flush()
    res
      .status(201)
      .json({ message: 'Posteo creado', data: post })
  } catch (error: any) {
    next(error)
  }
}


async function update(req: Request, res: Response, next: NextFunction) {
  const em = orm.em.fork();

  try {
    const id = req.params.idPosteo
    const { texto } = req.body.sanitizedInput

    const post = await em.findOne(Posteo, { id })
    if (!post) {
      throw new HttpError(404, 'NOT_FOUND', 'No se encontro el posteo a modificar')
    }

    if (texto) {
      post.texto = texto
    }

    const imagen = req.file ? `/uploads/${req.file.filename}` : post.imagenUrl;
    post.imagenUrl = imagen;

    await em.flush();
    res.status(200).json({ message: "Posteo actualizado correctamente", data: post });
  } catch (error: any) {
    next(error)
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  const em = orm.em.fork();

  try {
    const id = req.params.id
    const post = await em.findOne(Posteo, { id });
    if (!post) {
      throw new HttpError(404, 'NOT_FOUND', 'No se encontro el posteo a eliminar')
    }
    await em.removeAndFlush(post)
    res.status(200).send({ message: 'Post deleted' })
  } catch (error: any) {
    next(error)
  }
}



export { sanitizePosteoInput, findAll, findOne, add, findAllForUser, update, remove }

