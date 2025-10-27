import { Entity, OneToOne, Property, Rel } from '@mikro-orm/core'
import { BaseEntity } from "../../DB/baseEntity.entity.js";
import { Trabajo } from '../trabajos/trabajos.entity.js';

@Entity()
export class Resenia extends BaseEntity {
  @Property({ nullable: false })
  valor!: number; //el numero de estrellitas

  @Property({ nullable: true })
  descripcion!: string

  @OneToOne(() => Trabajo, { nullable: false })
  trabajo!: Rel<Trabajo>; // cada reseña pertenece a un trabajo
}
