import { Collection, Entity, OneToMany, Cascade, PrimaryKey } from "@mikro-orm/core";
import { Localidad } from "../localidad/localidades.entity.js";
import { Usuario } from "../usuario/usuario.entity.js";

@Entity()
export class Provincia {

  @PrimaryKey({ length: 100, unique: true, nullable: false })
  nombre!: string;

  @OneToMany(() => Localidad, localidad => localidad.provincia, { cascade: [Cascade.ALL], orphanRemoval: true })
  localidades = new Collection<Localidad>(this);

  @OneToMany(() => Usuario, usuario => usuario.provincia, { cascade: [Cascade.PERSIST] })
  usuarios = new Collection<Usuario>(this);
}