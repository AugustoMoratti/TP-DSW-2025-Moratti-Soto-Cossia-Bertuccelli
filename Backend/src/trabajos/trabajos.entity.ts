import {
    Entity,
    Property,
    ManyToOne,
    Rel,
    OneToOne
} from '@mikro-orm/core';
import { BaseEntity } from '../../DB/baseEntity.entity.js';
import { Usuario } from '../usuario/usuario.entity.js'
import { Resenia } from '../resenia/resenia.entity.js';


@Entity()
export class Trabajo extends BaseEntity {
    /*@Property({ nullable: false })
    estado!: string;*/  //No hace falta ya que sabemos que si esta pago la fecha de pago no es null

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

    @OneToOne(() => Resenia)
    resenia!: Rel<Resenia>
}
//La reseña va ligada al trabajo , cada trabajo puede tener 1 o ninguna reseña,
//dependiendo si se termino el trabajo
