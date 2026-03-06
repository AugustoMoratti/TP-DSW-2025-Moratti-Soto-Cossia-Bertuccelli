import { Entity, Property, OneToMany, Collection, Cascade, ManyToOne, Rel, Index } from '@mikro-orm/core';
import { Usuario } from '../usuario/usuario.entity.js';
import { BaseEntity2 } from '../../DB/baseEntity2.entity.js';



@Entity()
export class Posteo extends BaseEntity2 {
    @Property({ length: 255, nullable: true })
    imagenUrl!: string;

    @Property({ length: 1500, nullable: false })
    texto!: string;

    @Property({ onCreate: () => new Date() })
    @Index() // Lo usamos para el infinity scroll
    fechaCreacion!: Date;

    @ManyToOne(() => Usuario, { nullable: false })
    user!: Rel<Usuario>;
}