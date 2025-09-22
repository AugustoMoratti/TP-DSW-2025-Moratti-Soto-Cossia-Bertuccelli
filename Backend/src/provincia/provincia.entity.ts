import { Collection, Entity, OneToMany, Property, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "../../DB/baseEntity.entity.js";
import { Localidad } from "../localidad/localidades.entity.js";
import { Usuario } from "../usuario/usuario.entity.js";

@Entity()
export class Provincia extends BaseEntity {

  @Property({ length: 100, unique: true, nullable: false })
  nombre!: string;

  @OneToMany(() => Localidad, localidad => localidad.provincia, { cascade: [Cascade.ALL] })
  localidades = new Collection<Localidad>(this);

  @OneToMany(() => Usuario, usuario => usuario.provincia, { cascade: [Cascade.PERSIST] })
  usuarios = new Collection<Usuario>(this);
}