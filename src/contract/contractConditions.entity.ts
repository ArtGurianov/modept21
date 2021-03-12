import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ContractConditions extends BaseEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({type: 'int'})
  agencyCommissionPercent: number;

  @Column({type: 'text'})
  visaType: 'working' | 'business' | 'travel';

  @Column({type: 'boolean'})
  flightCredit: boolean;

  @Column({type: 'boolean'})
  apartmentCredit: boolean;

  @Column({type: 'boolean'})
  pocketMoneyCredit: boolean;

  @Column({type: 'text'})
  guaranteeType: 'gross' | 'net';

  @Column({type: 'int'})
  guaranteeAmount: number;

  @Column({type: 'text'})
  additional: string;

  @CreateDateColumn({ type: "timestamp with time zone" })
  periodFrom: Date;

  @CreateDateColumn({ type: "timestamp with time zone" })
  periodTill: Date;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;
}
