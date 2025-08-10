import { Repository } from '../shared/repository.js'
import { Trabajo } from './trabajos.entity.js'

const trabajos = [
    new Trabajo(
        'a02b91bc-3769-4221-beb1-d7a3aeba7dad',
        true,
        '2025-3-01',
        '2025-3-07',
        15000,
    ),
]

export class TrabajosRepository implements Repository<Trabajo> {
    public findAll(): Trabajo[] | undefined {
        return trabajos
    }

    public findOne(item: { id: string }): Trabajo | undefined {
        return trabajos.find((trabajo) => trabajo.id === item.id)
    }

    public add (item: Trabajo): Trabajo | undefined {
        const trabajo = trabajos.find((trabajo) => trabajo.fecha_solicitud === item.fecha_solicitud)
        if (!trabajo) {
            trabajos.push(item)
            return item
        } else {
            return
        }
    }

    public update(item: Trabajo): Trabajo | undefined {
        const trabajoIdx = trabajos.findIndex((trabajo) => trabajo.id === item.id)

        if (trabajoIdx !== -1) {
            trabajos[trabajoIdx] = { ...trabajos[trabajoIdx], ...item }
        }
        return trabajos[trabajoIdx]
    }

    public delete (item: { id: string }): Trabajo | undefined {
        const trabajoIdx = trabajos.findIndex((trabajo) => trabajo.id === item.id)

        if (trabajoIdx !== -1) {
            trabajos[trabajoIdx].estado = false
            const deletedTrabajo = trabajos[trabajoIdx]
            return deletedTrabajo
        }
    }
}