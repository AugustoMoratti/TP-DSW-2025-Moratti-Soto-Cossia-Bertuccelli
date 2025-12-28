import { Cascade, Rel, Collection, Entity, ManyToOne, OneToMany, Property, PrimaryKey } from "@mikro-orm/core";
import { Provincia } from "../provincia/provincia.entity.js";
import { Usuario } from "../usuario/usuario.entity.js";

@Entity()
export class Localidad {
  @PrimaryKey()
  id!: string;

  @Property({ length: 100, unique: true, nullable: false })
  nombre!: string;

  @ManyToOne(() => Provincia, { nullable: false })
  provincia!: Rel<Provincia>;

  @OneToMany(() => Usuario, usuario => usuario.localidad, { cascade: [Cascade.PERSIST] })
  usuarios = new Collection<Usuario>(this);

}
