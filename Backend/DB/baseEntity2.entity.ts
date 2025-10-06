import { PrimaryKey, Property } from "@mikro-orm/core";
import { v4 as uuidv4 } from 'uuid';

export abstract class BaseEntity2 {
    @PrimaryKey()
    id?: string = uuidv4();
}