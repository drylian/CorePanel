"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPermission = exports.Permissions = void 0;
const Configurations_1 = require("../../Configurations");
const typeorm_1 = require("typeorm");
/**
 * Permissions Rank
 */
var Permissions;
(function (Permissions) {
    Permissions[Permissions["Guest"] = 0] = "Guest";
    Permissions[Permissions["Client"] = 1] = "Client";
    Permissions[Permissions["Assistant"] = 2] = "Assistant";
    Permissions[Permissions["Supporter"] = 3] = "Supporter";
    Permissions[Permissions["Moderator"] = 4] = "Moderator";
    Permissions[Permissions["Manager"] = 5] = "Manager";
    Permissions[Permissions["Administrator"] = 6] = "Administrator";
    Permissions[Permissions["GeralAdministrator"] = 7] = "GeralAdministrator";
    Permissions[Permissions["Owner"] = 8] = "Owner";
})(Permissions || (exports.Permissions = Permissions = {}));
function GetPermission(value) {
    for (const key in Permissions) {
        if (Permissions[key] === value) {
            return key;
        }
    }
    return undefined;
}
exports.GetPermission = GetPermission;
let User = class User extends typeorm_1.BaseEntity {
    id;
    username;
    email;
    lang;
    password;
    permission;
    uuid;
    remember;
    suspended;
    suspendedReason;
    createdAt;
    updatedAt;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, default: Configurations_1.Global.language.get }),
    __metadata("design:type", String)
], User.prototype, "lang", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, default: Permissions.Client }),
    __metadata("design:type", Number)
], User.prototype, "permission", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], User.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "remember", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], User.prototype, "suspended", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "suspendedReason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
User = __decorate([
    (0, typeorm_1.Entity)("users")
], User);
exports.default = User;
