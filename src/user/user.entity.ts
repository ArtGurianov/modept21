import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { File } from '../file/file.entity';
import { UserTypes } from '../types/userTypes.enum';
@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text', unique: true, nullable: false })
  email!: string;

  @Column({ type: 'boolean', default: false })
  isPasswordSet!: boolean;

  @Column({ type: 'text', nullable: false })
  password!: string;

  @Column({ type: 'int', default: 0 })
  tokenVersion: number;

  @Column({ type: 'text' })
  userType: UserTypes;

  @OneToMany(() => File, file => file.userConnection)
  uploadedFilesConnection: Promise<File[] | null>;

  @Column({ type: "timestamp with time zone", default: Date.now() })
  bannedUntil: Date;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;
}
