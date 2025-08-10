var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Cascade, Collection, Entity, ManyToOne, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../DB/baseEntity.entity.js";
import { Provincia } from "../provincia/provincia.entity.js";
import { Usuario } from "../usuario/usuario.entity.js";
export let Localidades = class Localidades extends BaseEntity {
    constructor() {
        super(...arguments);
        this.usuarios = new Collection(this);
    }
};
__decorate([
    Property({ length: 100, unique: true, nullable: false }),
    __metadata("design:type", String)
], Localidades.prototype, "nombre", void 0);
__decorate([
    Property({ length: 10, unique: true, nullable: false }),
    __metadata("design:type", String)
], Localidades.prototype, "codPostal", void 0);
__decorate([
    ManyToOne(() => Provincia, { nullable: false }),
    __metadata("design:type", Provincia)
], Localidades.prototype, "provincia", void 0);
__decorate([
    OneToMany(() => Usuario, usuario => usuario.localidad, { cascade: [Cascade.ALL] }),
    __metadata("design:type", Object)
], Localidades.prototype, "usuarios", void 0);
Localidades = __decorate([
    Entity()
], Localidades);
//# sourceMappingURL=localidades.entity.js.map