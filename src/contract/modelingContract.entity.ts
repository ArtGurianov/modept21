import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Agency } from '../agency/agency.entity';
import { ContractTypes } from '../types/contractTypes.enum';
import { Model } from '../user/model/model.entity';
import { Conditions } from './conditions.entity';

@Entity()
export class ModelingContract extends BaseEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({type: 'text'})
  contractType: ContractTypes.MODELING;

  @ManyToOne(() => Agency, motherAgency => motherAgency.contractsAsMotherAgencyConnection, { primary: true })
  @JoinColumn({ name: "motherAgencyId" })
  motherAgencyConnection: Promise<Agency>;
  @Column("uuid")
  motherAgencyId: string;

  @ManyToOne(() => Agency, modelingAgency => modelingAgency.contractsAsModelingAgencyConnection, { nullable: true })
  @JoinColumn({ name: "modelingAgencyId" })
  modelingAgencyConnection: Promise<Agency>;
  @Column("uuid")
  modelingAgencyId: string;

  @ManyToOne(() => Model, model => model.contractsWithModelingAgenciesConnection, { primary: true })
  @JoinColumn({ name: "modelId" })
  modelConnection: Promise<Model>;
  @Column("uuid")
  modelId: string;

  @OneToOne(() => Conditions)
  motherAgencyConditions: Conditions;

  @OneToOne(() => Conditions)
  modelingAgencyConditions: Conditions;

  @Column({type: 'text', default: "modelingAgency"})
  contitionsLastChangeBy: "motherAgency" | "modelingAgency";

  @Column({type: 'boolean', default: false})
  conditionsAgreed: boolean;

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

  @Column({ type: 'int' })
  modelingAgencyFeedbackRating: number;

  @Column({ type: 'text' })
  modelingAgencyFeedbackComment: string;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;
}
