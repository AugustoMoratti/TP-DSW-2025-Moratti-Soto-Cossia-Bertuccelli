import {
    Entity,
    Property
} from '@mikro-orm/core';

import { BaseEntity2 } from '../../DB/baseEntity2.entity.js';

@Entity()
export class Administrador extends BaseEntity2 {
    @Property({ length: 20 })
    user!: string;

    @Property({ length: 100, nullable: false })
    clave!: string;

    @Property({ length: 100, unique: true, nullable: false })
    email!: string;
}