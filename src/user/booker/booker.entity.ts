import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Agency } from '../../agency/agency.entity';
import { Booker2Agency } from '../../agency/booker2agency.entity';
import { User } from '../user.entity';

@Entity()
export class Booker extends BaseEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'text', unique: true, nullable: false })
  email!: string;

  @Column({ type: 'int', default: 0 })
  tokenVersion: number;

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE', primary: true })
  @JoinColumn({ name: 'userId' })
  user: User;
  @Column({ name: 'userId' })
  userId: string;

  @OneToMany(() => Booker2Agency, b2a => b2a.booker)
  b2aConnection: Promise<Booker2Agency[]>;
  bookerOf!: Promise<Agency[] | null>;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;
}
