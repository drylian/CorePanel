import { Global } from "@/Configurations";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";

/**
 * Permissions Rank
 */
export enum Permissions {
    Guest = 0,
    Client = 1,
    Assistant = 2,
    Supporter = 3,
    Moderator = 4,
    Manager = 5,
    Administrator = 6,
    GeralAdministrator = 7,
    Owner = 8,
}
export function GetPermission(value: typeof Permissions[keyof typeof Permissions]): string | undefined {
    for (const key in Permissions) {
        if (Permissions[key as keyof typeof Permissions] === value) {
            return key;
        }
    }
    return undefined;
}

@Entity("Users")
export default class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false })
    username!: string;

    @Column({ nullable: false })
    email!: string;

    @Column({ nullable: false, default: Global.language.get })
    lang!: string;

    @Column({ nullable: false })
    password!: string;

    @Column({ nullable: false, default:Permissions.Client })
    permission!: Permissions;

    @Column({ nullable: false })
    uuid!: string;

    @Column({ nullable: true })
    remember!: string;

    @Column({ nullable: true })
    suspended!: boolean;

    @Column({ nullable: true })
    suspendedReason!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
export type UserCookie = Omit<InstanceType<typeof User>, 'password' | 'id'>