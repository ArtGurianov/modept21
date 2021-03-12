import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Contract } from '../contract/contract.entity';
import { Booker } from '../user/booker/booker.entity';
import { Booker2Agency } from './booker2agency.entity';

@Entity()
export class Agency extends BaseEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @PrimaryColumn('uuid') 
  creatorId!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text' })
  country!: string;

  @Column({ type: 'text' })
  vat!: string;

  @OneToMany(() => Contract, contract => contract.agencyConnection)
  contractsConnection: Promise<Contract[] | null>;

  @OneToMany(() => Booker2Agency, b2a => b2a.agency)
  bookersConnection: Promise<Booker2Agency[]>;
  bookers: Promise<Booker[] | null>;

  @Column({ type: "timestamp with time zone", default: Date.now() })
  bannedUntil: Date;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;
}
