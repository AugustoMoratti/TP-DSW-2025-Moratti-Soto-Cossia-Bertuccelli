import {
    Entity,
    Property
} from '@mikro-orm/core';
import { BaseEntity } from '../../DB/baseEntity.entity.js';

@Entity()
export class Profesiones extends BaseEntity {
    @Property({ length: 50, nullable: false })//Clave primaria y cambiar los find
    nombreProfesion!: string;

    @Property({ length: 200, nullable: false })
    descripcionProfesion!: string;

    @Property({ length: 10, nullable: false })
    estado!: string;
}
