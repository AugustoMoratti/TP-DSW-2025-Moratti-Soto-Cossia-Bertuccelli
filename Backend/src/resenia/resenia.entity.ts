import { Entity, ManyToOne, Property, Rel, ManyToMany, Collection, Cascade } from '@mikro-orm/core'
import { BaseEntity } from "../../DB/baseEntity.entity.js";

@Entity()
export class Resenia extends BaseEntity {
  @Property({ nullable: false })
  valor!: number; //el numero de estrellitas

  @Property({ nullable: true })
  descripcion!: string
}
