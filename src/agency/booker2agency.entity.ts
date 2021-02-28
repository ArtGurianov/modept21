import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BookerRoles } from "../types/bookerRoles.enum";
import { Booker } from "../user/booker/booker.entity";
import { Agency } from "./agency.entity";


@Entity()
export class Booker2Agency {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'text' })
  bookerRole: BookerRoles;

  @PrimaryColumn("uuid")
  createdBy: string;

  @PrimaryColumn("uuid")
  promotedBy: string;

  @PrimaryColumn("uuid")
  demotedBy: string;

  @PrimaryColumn("uuid")
  activatedBy: string;

  @PrimaryColumn("uuid")
  deactivatedBy: string;

  @ManyToOne(() => Booker, booker => booker.b2aConnection, { primary: true })
  @JoinColumn({ name: "bookerId" })
  booker: Promise<Booker>;
  @Column("uuid")
  bookerId: string;

  @ManyToOne(() => Agency, agency => agency.bookersConnection, {
    primary: true,
  })
  @JoinColumn({ name: "agencyId" })
  agency: Promise<Agency>;
  @Column("uuid")
  agencyId: string;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;
}
