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
var Activities_1;
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
let Activities = Activities_1 = class Activities extends typeorm_1.BaseEntity {
    id;
    createdAt;
    updatedAt;
    user_uuid;
    type;
    action;
    path;
    ip;
    alert;
    admin;
    /**
     * Makes new Activity of user
     * @param user PanelUser
     * @param action Action of Activity
     */
    static async new(user, action, alert = "Info") {
        const activity = Activities_1.create({
            action: action,
            type: user.access,
            user_uuid: String(user.uuid),
            ip: user.ip || "0.0.0.0",
            path: user.path,
            alert: alert,
            admin: user.path.startsWith("/api/admin") ? true : false
        });
        await activity.save();
    }
    /**
     * Makes new Activity of System
     * @param action Action of Activity
     * @param alert type of activity , default is Info
     */
    static async sys(action, alert = "Info") {
        const activity = Activities_1.create({
            action: action,
            type: "System",
            user_uuid: String("System"),
            ip: "Internal",
            path: "Internal",
            alert: alert,
            admin: true
        });
        await activity.save();
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Activities.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Activities.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Activities.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Activities.prototype, "user_uuid", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Activities.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Activities.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Activities.prototype, "path", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Activities.prototype, "ip", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Activities.prototype, "alert", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", nullable: false }),
    __metadata("design:type", Boolean)
], Activities.prototype, "admin", void 0);
Activities = Activities_1 = __decorate([
    (0, typeorm_1.Entity)({ name: "Activities" })
], Activities);
exports.default = Activities;
