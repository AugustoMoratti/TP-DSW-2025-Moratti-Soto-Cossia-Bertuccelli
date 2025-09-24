import {
    Entity,
    PrimaryKey,
    Property
} from '@mikro-orm/core';

import { BaseEntity } from '../../DB/baseEntity.entity.js';

@Entity()
export class Administrador {
    @PrimaryKey({ length: 20 })
    user!: string;

    @Property({ length: 50, nullable: false })
    clave!: string;

    /*@Property({ length: 25 , nullable: false }) //Vamos a tener solo un administrador que pueda aceptar o denegar Profesiones nuevas
    estado!: string;*/

}