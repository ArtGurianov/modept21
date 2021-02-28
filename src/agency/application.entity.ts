import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApplicationStatuses } from '../types/applicationStatuses.enum';

@Entity()
export class Application extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' }) 
  creatorEmail!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text' })
  country!: string;

  @Column({ type: 'text' })
  vat!: string;

  @Column({ type: 'text' })
  businessLicenseImageUrl: string;

  @Column({ type: 'text', default: ApplicationStatuses.PENDING })
  status!: ApplicationStatuses;

  @Column({ type: 'uuid' })
  reviewerId!: string;

  @Column({ type: 'text' })
  reviewerComment!: string;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;
}
