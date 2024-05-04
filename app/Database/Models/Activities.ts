import { PanelUser } from "@/Application";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, UpdateDateColumn, CreateDateColumn } from "typeorm";

@Entity({ name: "Activities" })
export default class Activities extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: false })
  user_uuid!: string;

  @Column({ nullable: false })
  type!: "User" | "Token" | "System";

  @Column({ nullable: false })
  action!: string;

  @Column({ nullable: false })
  path!: string;

  @Column({ nullable: false })
  ip!: string;

  @Column({ nullable: false })
  alert!: "Success" | "Warning" | "Error" | "Info";

  @Column({ type: "boolean", nullable: false })
  admin!: boolean;

  /**
   * Makes new Activity of user
   * @param user PanelUser
   * @param action Action of Activity
   */
  static async new(user: PanelUser, action: string, alert: "Success" | "Warning" | "Error" | "Info" = "Info") {
    const activity = Activities.create({
      action: action,
      type: user.access,
      user_uuid: String(user.uuid),
      ip: user.ip || "0.0.0.0",
      path: user.path,
      alert: alert,
      admin: user.path.startsWith("/api/admin") ? true : false
    })
    await activity.save();
  }

  /**
   * Makes new Activity of System
   * @param action Action of Activity
   * @param alert type of activity , default is Info
   */
  static async sys(action: string, alert: "Success" | "Warning" | "Error" | "Info" = "Info") {
    const activity = Activities.create({
      action: action,
      type: "System",
      user_uuid: String("System"),
      ip: "Internal",
      path: "Internal",
      alert: alert,
      admin: true
    })
    await activity.save();
  }
}
