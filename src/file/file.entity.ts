import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class File extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({type: 'text'})
  mimeType: string;

  @Column({type: 'text'})
  s3FilePath: string;

  @ManyToOne(() => User, user => user.uploadedFilesConnection, { primary: true })
  @JoinColumn({ name: "uploadedByUserId" })
  userConnection: Promise<User>;
  @Column("uuid")
  uploadedByUserId: string;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;
}
