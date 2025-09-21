import { Cascade, Collection, Entity, ManyToOne, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../DB/baseEntity.entity.js";
import { Provincia } from "../provincia/provincia.entity.js";
import { Usuario } from "../usuario/usuario.entity.js";

@Entity()
export class Localidades extends BaseEntity {

  @Property({ length: 100, unique: true, nullable: false })
  nombre!: string;

  @Property({ length: 10, unique: true, nullable: false })
  codPostal!: string;

  @ManyToOne(() => Provincia, { nullable: false })
  provincia!: Provincia;

  @OneToMany(() => Usuario, usuario => usuario.localidad, { cascade: [Cascade.ALL] })
  usuarios = new Collection<Usuario>(this);
}
