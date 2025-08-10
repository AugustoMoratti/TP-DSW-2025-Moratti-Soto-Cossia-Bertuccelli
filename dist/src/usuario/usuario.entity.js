var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../DB/baseEntity.entity.js';
import { Localidades } from "../localidad/localidades.entity.js";
export let Usuario = class Usuario extends BaseEntity {
};
__decorate([
    Property({ length: 100, nullable: false }),
    __metadata("design:type", String)
], Usuario.prototype, "nombre", void 0);
__decorate([
    Property({ length: 100, nullable: false }),
    __metadata("design:type", String)
], Usuario.prototype, "apellido", void 0);
__decorate([
    Property({ length: 100, nullable: false }),
    __metadata("design:type", String)
], Usuario.prototype, "clave", void 0);
__decorate([
    Property({ length: 100, unique: true, nullable: false }),
    __metadata("design:type", String)
], Usuario.prototype, "email", void 0);
__decorate([
    Property({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "descripcion", void 0);
__decorate([
    Property({ length: 255, nullable: true }),
    __metadata("design:type", Number)
], Usuario.prototype, "contacto", void 0);
__decorate([
    ManyToOne(() => Localidades, { nullable: false }),
    __metadata("design:type", Object)
], Usuario.prototype, "localidad", void 0);
Usuario = __decorate([
    Entity()
], Usuario);
//# sourceMappingURL=usuario.entity.js.map