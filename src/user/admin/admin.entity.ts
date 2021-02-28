import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { AdminRoles } from '../../types/adminRoles.enum';
import { User } from '../user.entity';

@Entity()
export class Admin extends BaseEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'text' })
  adminRole: AdminRoles;

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE', primary: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ name: 'userId' })
  userId: string;
}
