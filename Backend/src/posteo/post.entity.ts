import { Entity, Property, OneToMany, Collection, Cascade, ManyToOne, Rel } from '@mikro-orm/core';
import { Usuario } from '../usuario/usuario.entity.js';
import { BaseEntity2 } from '../../DB/baseEntity2.entity.js';



@Entity()
export class Posteo extends BaseEntity2 {
    @Property({ length: 255, nullable: true })
    imagenUrl!: string;

    @Property({ length: 1500, nullable: false })
    texto!: string;

    @Property({ onCreate: () => new Date() })
    fechaCreacion!: Date;

    @ManyToOne(() => Usuario, { nullable: false })
    user!: Rel<Usuario>;
}