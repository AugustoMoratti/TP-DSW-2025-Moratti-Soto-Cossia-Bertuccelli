import { Entity, ManyToOne, Property, Rel, ManyToMany, Collection, Cascade } from '@mikro-orm/core'
import { BaseEntity } from '../../DB/baseEntity.entity.js'
import { Localidad } from "../localidad/localidades.entity.js";
import { Profesiones } from "../profesion/profesion.entity.js";
import { Provincia } from "../provincia/provincia.entity.js";

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
  descripcion!: string;

  @Property({ length: 50, nullable: false })
  contacto!: string;

  @ManyToOne(() => Localidad, { nullable: false })
  localidad!: Rel<Localidad>;

  @ManyToOne(() => Provincia, { nullable: false })
  provincia!: Rel<Provincia>;

  @ManyToMany(() => Profesiones, undefined, { cascade: [Cascade.PERSIST] })
  profesiones = new Collection<Profesiones>(this);
  //Un usuario puede tener muchas profesiones o ninguna, con esto se soluciona , es una ManyToMany unidireccional y no hace 
  // falta ponerla en el crud de profesion.

  //Recordar que si no se envia ninguna profesion, pues se borran todas las que estan, asique cada vez que 
  // actualizemos un usuario, debemos pedirle nuevamente la profesion para no tener problemas.
  //Idea , para modificar un usuario realizar un form completo de todas las propiedades del usuario

  @Property({ nullable: false })
  horarios!: string;

  //Agregar foto de perfil
}