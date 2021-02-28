import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Conditions extends BaseEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({type: 'text'})
  visaType: 'working' | 'business' | 'travel';

  @Column({type: 'boolean'})
  flightLoan: boolean;

  @Column({type: 'boolean'})
  apartmentLoan: boolean;

  @Column({type: 'boolean'})
  pocketMoneyLoan: boolean;

  @Column({type: 'text'})
  guaranteeType: 'gross' | 'net';

  @Column({type: 'int'})
  guaranteeAmount: number;

  @Column({type: 'text'})
  additional: string;

  @CreateDateColumn({ type: "timestamp with time zone" })
  periodFrom: Date;

  @CreateDateColumn({ type: "timestamp with time zone" })
  periodUntil: Date;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;
}
