import { Repository } from "../shared/repository.js"
import { administrador } from './admin.entity.js'

const administradores = [
    new administrador(
        'adminMain',
        '1234',
        true,
        'a02b91bc-3769-4221-beb1-d7a3aeba7dad'
    )
]

export class administradorRepository implements Repository<administrador> {
  public findAll(): administrador[] | undefined {
    return administradores
  }

  public findOne(item: { id: string }): administrador | undefined {
    return administradores.find((administrador) => administrador.idAdmin === item.id)
  }

  public add(item: administrador): administrador | undefined {
    const adm = administradores.find((administrador) => administrador.user === item.user)
    if (!adm) {
      administradores.push(item)
      return item
    } else {
      return
    }

  }

  public update(item: administrador): administrador | undefined {
    const administradorIdx = administradores.findIndex((administrador) => administrador.idAdmin === item.idAdmin)

    if (administradorIdx !== -1) {
      administradores[administradorIdx] = { ...administradores[administradorIdx], ...item }
    }
    return administradores[administradorIdx]
  }

  public delete(item: { id: string }): administrador | undefined {
    const administradorIdx = administradores.findIndex((administrador) => administrador.idAdmin === item.id)
    //devuelve la posicion si lo encuentra, sino -1

    if (administradorIdx !== -1) {
      administradores[administradorIdx].estado = false
      const deletedAdmin = administradores[administradorIdx]
      return deletedAdmin
    }
  }
}