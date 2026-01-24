import {
    Entity,
    Property,
    ManyToOne,
    Rel,
    OneToOne,
    Cascade
} from '@mikro-orm/core';
import { BaseEntity } from '../../DB/baseEntity.entity.js';
import { Usuario } from '../usuario/usuario.entity.js'
import { Resenia } from '../resenia/resenia.entity.js';


@Entity()
export class Trabajo extends BaseEntity {

    @Property({ nullable: true })
    descripcion!: string;

    @Property({ nullable: true })
    montoTotal?: number;

    @ManyToOne(() => Usuario, { nullable: false })
    cliente!: Rel<Usuario>;

    @ManyToOne(() => Usuario, { nullable: false })
    profesional!: Rel<Usuario>;

    @Property({ nullable: false })
    fechaSolicitud!: string;

    @Property({ nullable: true })
    fechaPago?: string;

    @Property({ nullable: true })
    fechaFinalizado!: string; 

    @OneToOne(() => Resenia, resenia => resenia.trabajo, { nullable: true, cascade: [Cascade.PERSIST, Cascade.REMOVE] })
    resenia?: Rel<Resenia>;
}
//La reseña va ligada al trabajo , cada trabajo puede tener 1 o ninguna reseña,
//dependiendo si se termino el trabajo
