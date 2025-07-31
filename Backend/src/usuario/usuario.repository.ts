import { Repository } from '../shared/repository.js'
import { Usuario } from './usuario.entity.js'


const usuarios = [
  new Usuario(
    'Augusto',
    'Moratti',
    'a1b2c3',
    'agus@gmail.com',
    'Usuario No profesional',
    34123456789,
    '2000',
    'a02b91bc-3769-4221-beb1-d7a3aeba7dad'
  ),
]

export class UsuarioRepository implements Repository<Usuario> {
  public findAll(): Usuario[] | undefined {
    return usuarios
  }

  public findOne(item: { id: string }): Usuario | undefined {
    return usuarios.find((usuario) => usuario.id === item.id)
  }

  public add(item: Usuario): Usuario | undefined {
    const usu = usuarios.find((usuario) => usuario.email === item.email)
    if (!usu) {
      usuarios.push(item)
      return item
    } else {
      return
    }
  }

  //Falta terminar
  public update(item: Usuario): Usuario | undefined {
    const usuarioIdx = usuarios.findIndex((usuario) => usuario.id === item.id)

    if (usuarioIdx !== -1) {
      usuarios[usuarioIdx] = { ...usuarios[usuarioIdx], ...item }
    }
    return usuarios[usuarioIdx]
  }

  public delete(item: { id: string }): Usuario | undefined {
    const usuarioIdx = usuarios.findIndex((usuario) => usuario.id === item.id)
    //devuelve la posicion si lo encuentra, sino -1

    if (usuarioIdx !== -1) {
      const deletedUsuario = usuarios[usuarioIdx]
      usuarios.splice(usuarioIdx, 1)
      return deletedUsuario
    }
  }
}