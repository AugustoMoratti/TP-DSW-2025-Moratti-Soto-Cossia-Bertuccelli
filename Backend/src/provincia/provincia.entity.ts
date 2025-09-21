import { Collection, Entity, ManyToOne, OneToMany, Property, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "../../DB/baseEntity.entity.js";
import { Localidades } from "../localidad/localidades.entity.js";
import { Usuario } from "../usuario/usuario.entity.js";

@Entity()
export class Provincia extends BaseEntity {

  @Property({ length: 100, unique: true, nullable: false })
  nombre!: string;

  @OneToMany(() => Localidades, localidad => localidad.provincia, { cascade: [Cascade.ALL] })
  localidad = new Collection<Localidades>(this);

  @OneToMany(() => Usuario, usuario => usuario.localidad, { cascade: [Cascade.ALL] })
  usuarios = new Collection<Usuario>(this);
}