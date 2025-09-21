import {
    Entity,
    Property,
    ManyToOne,
    Rel
} from '@mikro-orm/core';
import { BaseEntity } from '../../DB/baseEntity.entity.js';
import { Usuario } from '../usuario/usuario.entity.js'


@Entity()
export class Trabajo extends BaseEntity {
    @Property({ nullable: false })
    estado!: string;

    @Property({ nullable: false })
    montoTotal!: number;

    @ManyToOne(() => Usuario, { nullable: false })
    cliente!: Rel<Usuario>;

    @ManyToOne(() => Usuario, { nullable: false })
    profesional!: Rel<Usuario>;

    @Property({ nullable: true })
    pagado!: boolean;

    @Property({ nullable: true })
    fechaPago!: Date;

    @Property({ nullable: false })
    fechaSolicitud!: Date;

    @Property({ nullable: true })
    fechaFinalizado!: Date;
}
