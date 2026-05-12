import { Entity, Enum, ManyToOne, PrimaryKey, Unique } from '@mikro-orm/core'
import { v4 as uuidv4 } from 'uuid'
import { Posteo } from '../posteo/post.entity.js'
import { Usuario } from '../usuario/usuario.entity.js'

export enum TipoReaccion {
  LIKE = 'like',
  DISLIKE = 'dislike',
}

@Entity()
@Unique({ properties: ['user', 'posteo'] }) // Un usuario solo puede reaccionar una vez por post
export class Reaccion {
  @PrimaryKey()
  id: string = uuidv4()

  @ManyToOne(() => Usuario)
  user!: Usuario

  @ManyToOne(() => Posteo)
  posteo!: Posteo

  @Enum(() => TipoReaccion)
  tipo!: TipoReaccion
}
