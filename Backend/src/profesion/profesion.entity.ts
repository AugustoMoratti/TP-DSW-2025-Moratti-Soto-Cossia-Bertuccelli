import {
    Entity,
    PrimaryKey,
    Property
} from '@mikro-orm/core';
import { BaseEntity } from '../../DB/baseEntity.entity.js';

@Entity()
export class Profesiones {
    @PrimaryKey({ length: 50, nullable: false, unique: true })
    nombreProfesion!: string;

    @Property({ length: 200, nullable: false })
    descripcionProfesion!: string;

    @Property({ nullable: false })
    estado!: boolean;  //True es activo y False es que se tiene que aceptar por el admin, si se rechaza se elimina
}
