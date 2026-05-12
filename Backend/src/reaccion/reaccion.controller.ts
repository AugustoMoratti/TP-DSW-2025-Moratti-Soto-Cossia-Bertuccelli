import { Request, Response, NextFunction } from 'express'
import { orm } from '../../DB/orm.js'
import { HttpError } from '../types/HttpError.js'
import { Reaccion, TipoReaccion } from './reaccion.entity.js'
import { Posteo } from '../posteo/post.entity.js'
import { Usuario } from '../usuario/usuario.entity.js'

async function reaccionar(req: Request, res: Response, next: NextFunction) {
  const em = orm.em.fork()

  try {
    const { idPosteo } = req.params
    const { userId, tipo } = req.body

    if (!userId || typeof userId !== 'string') {
      throw new HttpError(400, 'INVALID_INPUT', 'El id del usuario es obligatorio')
    }
    if (tipo !== TipoReaccion.LIKE && tipo !== TipoReaccion.DISLIKE) {
      throw new HttpError(400, 'INVALID_INPUT', 'El tipo debe ser "like" o "dislike"')
    }

    const posteo = await em.findOne(Posteo, { id: idPosteo })
    if (!posteo) {
      throw new HttpError(404, 'NOT_FOUND', 'Posteo no encontrado')
    }

    const user = em.getReference(Usuario, userId)

    const reaccionExistente = await em.findOne(Reaccion, { user, posteo })

    if (reaccionExistente) {
      if (reaccionExistente.tipo === tipo) {
        await em.removeAndFlush(reaccionExistente)
        return res.status(200).json({ message: 'Reaccion eliminada', reaccion: null })
      } else {
        reaccionExistente.tipo = tipo
        await em.flush()
        return res.status(200).json({ message: 'Reaccion actualizada', reaccion: reaccionExistente })
      }
    }

    const nuevaReaccion = new Reaccion()
    nuevaReaccion.user = user
    nuevaReaccion.posteo = posteo
    nuevaReaccion.tipo = tipo

    em.persist(nuevaReaccion)
    await em.flush()

    return res.status(201).json({ message: 'Reaccion creada', reaccion: nuevaReaccion })
  } catch (error: any) {
    next(error)
  }
}

async function getReacciones(req: Request, res: Response, next: NextFunction) {
  const em = orm.em.fork()

  try {
    const { idPosteo } = req.params
    const { userId } = req.query

    const posteo = await em.findOne(Posteo, { id: idPosteo })
    if (!posteo) {
      throw new HttpError(404, 'NOT_FOUND', 'Posteo no encontrado')
    }

    const likes = await em.count(Reaccion, { posteo, tipo: TipoReaccion.LIKE })
    const dislikes = await em.count(Reaccion, { posteo, tipo: TipoReaccion.DISLIKE })

    let reaccionUsuario: string | null = null
    if (userId && typeof userId === 'string') {
      const user = em.getReference(Usuario, userId)
      const reaccion = await em.findOne(Reaccion, { user, posteo })
      reaccionUsuario = reaccion ? reaccion.tipo : null
    }

    return res.status(200).json({ likes, dislikes, reaccionUsuario })
  } catch (error: any) {
    next(error)
  }
}

export { reaccionar, getReacciones }
