import { Entity, ManyToOne, Property, Rel, ManyToMany, Collection, Cascade, OneToMany } from '@mikro-orm/core'
import { BaseEntity2 } from '../../DB/baseEntity2.entity.js'
import { Localidad } from "../localidad/localidades.entity.js";
import { Profesiones } from "../profesion/profesion.entity.js";
import { Provincia } from "../provincia/provincia.entity.js";
import { Trabajo } from '../trabajos/trabajos.entity.js';


@Entity()
export class Usuario extends BaseEntity2 {
  @Property({ length: 25, nullable: false })
  nombre!: string;

  @Property({ length: 25, nullable: false })
  apellido!: string;

  @Property({ length: 100, nullable: false })
  clave!: string;

  @Property({ length: 100, unique: true, nullable: false })
  email!: string;

  @Property({ length: 80, nullable: false })
  direccion!: string;

  @Property({ length: 250, nullable: true })
  descripcion!: string;

  @Property({ length: 10, nullable: false })
  fechaNac!: string;

  @Property({ length: 15, nullable: false })
  contacto!: string;

  @Property({ length: 255, nullable: true }) //FOTO DE PERFIL DEL USUARIO
  fotoUrl!: string;

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

  @Property({ nullable: true })
  horarios!: string;

  @OneToMany(() => Trabajo, trabajo => trabajo.profesional, { cascade: [Cascade.PERSIST] })
  trabajos = new Collection<Trabajo>(this);

  @Property({ nullable: true })
  habilidades: string[] = [];


}