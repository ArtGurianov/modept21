import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Agency } from '../agency/agency.entity';
import { ContractTypes } from '../types/contractTypes.enum';
import { Model } from '../user/model/model.entity';

@Entity()
export class MotherContract extends BaseEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({type: 'text'})
  contractType: ContractTypes.MOTHER;

  @ManyToOne(() => Agency, motherAgency => motherAgency.contractsAsMotherAgencyConnection, { primary: true })
  @JoinColumn({ name: "motherAgencyId" })
  motherAgencyConnection: Promise<Agency>;
  @Column("uuid")
  motherAgencyId: string;

  @ManyToOne(() => Model, model => model.contractsWithMotherAgenciesConnection, { primary: true })
  @JoinColumn({ name: "modelId" })
  modelConnection: Promise<Model>;
  @Column("uuid")
  modelId: string;

  @Column({type: 'text'})
  unsignedPdfLink: string;

  @Column({type: 'text'})
  signedPdfLink: string;

  @Column({ type: 'boolean', default: true })
  isPending: boolean;

  @Column({ type: 'boolean', default: false })
  isRejected: boolean;

  @Column({ type: 'boolean', default: false })
  isSigned: boolean;

  @Column({ type: 'boolean', default: false })
  isFinished: boolean;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;
}
