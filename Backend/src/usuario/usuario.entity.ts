import { Entity, ManyToOne, OneToMany, Property, Rel } from '@mikro-orm/core'
import { BaseEntity } from '../../DB/baseEntity.entity.js'
import { Localidades } from "../localidad/localidades.entity.js";

@Entity()
export class Usuario extends BaseEntity {
  @Property({ length: 100, nullable: false })
    nombre!: string;

  @Property({ length: 100, nullable: false })
    apellido!: string;

  @Property({ length: 100, nullable: false })
    clave!: string;

  @Property({ length: 100, unique: true, nullable: false })
    email!: string;

  @Property({ length: 100, nullable: true })
    descripcion?: string;

  @Property({ length:255, nullable: true })
    contacto?: number;

  @ManyToOne(() => Localidades, { nullable: false })
    localidad!: Rel<Localidades>;
}