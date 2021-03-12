import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Agency } from '../agency/agency.entity';
import { ContractTypes } from '../types/contractTypes.enum';
import { Model } from '../user/model/model.entity';
import { ContractConditions } from './contractConditions.entity';

@Entity()
export class Contract extends BaseEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({type: 'text'})
  contractType: ContractTypes;

  @ManyToOne(() => Agency, agency => agency.contractsAsOffererConnection, { primary: true })
  @JoinColumn({ name: "offererId" })
  offererConnection: Promise<Agency>;
  @Column("uuid")
  offererId: string;

  @ManyToOne(() => Agency, agency => agency.contractsAsIntermediaryConnection, { nullable: true })
  @JoinColumn({ name: "intermediaryId" })
  intermediaryConnection: Promise<Agency>;
  @Column("uuid")
  intermediaryId?: string;

  @ManyToOne(() => Model, model => model.contractsWithModelingAgenciesConnection, { primary: true })
  @JoinColumn({ name: "modelId" })
  modelConnection: Promise<Model>;
  @Column("uuid")
  modelId: string;

  @OneToOne(() => ContractConditions)
  conditions: ContractConditions;

  // @OneToOne(() => Conditions)
  // offererConditions: Conditions;

  // @OneToOne(() => Conditions)
  // intermediaryConditions: Conditions;

  // @OneToOne(() => Conditions)
  // modelConditions: Conditions;

  // CONDITIONS LOGIC:
  // First we assign offerer condtitions to everyone as already accepted!
  // - conditionsLastChangeBy === "offerer":
  // send request to Intermediary (if not present, send to model). Accepted passes, rejected returns back.
  // - conditionsLastChangeBy === "intermediary":
  // check if changed conditions is actually same (unchanged). Then passes. Otherwise returns to offerer.
  // - conditionsLastChangeBy === "model":
  // check if changed conditions is actually same (unchanged). Then DONE. Otherwise returns to offerer.
  @Column({type: 'text', default: "offerer"})
  conditionsLastChangeBy: "offerer" | "intermediary" | "model";

  @Column({type: 'boolean', default: false})
  conditionsAgreed: boolean;

  @Column({type: 'text'})
  signedByOffererPdfLink: string;

  @Column({type: 'text'})
  signedByIntermediaryPdfLink: string;

  @Column({type: 'text'})
  signedByModelPdfLink: string;

  @Column({ type: 'boolean', default: true })
  isPending: boolean;

  @Column({ type: 'boolean', default: false })
  isRejected: boolean;

  @Column({ type: 'boolean', default: false })
  isSigned: boolean;

  @Column({ type: 'boolean', default: false })
  isFinished: boolean;

  @Column({ type: 'int' })
  offererFeedbackRating: number;

  @Column({ type: 'text' })
  offererFeedbackComment: string;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;
}
