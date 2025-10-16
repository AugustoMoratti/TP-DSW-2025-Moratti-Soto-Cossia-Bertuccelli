import { PrimaryKey } from "@mikro-orm/core";
import { v4 as uuidv4 } from 'uuid';

export abstract class BaseEntity2 {
    @PrimaryKey({ type: 'string' })
    id?: string = uuidv4();
}