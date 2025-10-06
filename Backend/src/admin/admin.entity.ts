import {
    Entity,
    PrimaryKey,
    Property
} from '@mikro-orm/core';

import { BaseEntity2 } from '../../DB/baseEntity2.entity.js';

@Entity()
export class Administrador extends BaseEntity2 {
    @PrimaryKey({ length: 20 })
    user!: string;

    @Property({ length: 50, nullable: false })
    clave!: string;

    /*@Property({ length: 25 , nullable: false }) //Vamos a tener solo un administrador que pueda aceptar o denegar Profesiones nuevas
    estado!: string;*/

}