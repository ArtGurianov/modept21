import { AfterLoad, BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { ModelingContract } from '../../contract/contract.entity';
import { MotherContract } from '../../contract/motherContract.entity';
import { User } from '../user.entity';

@Entity()
export class Model extends BaseEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'text', nullable: false })
  email!: string;

  @Column({ type: 'text', nullable: false })
  firstName!: string;

  @Column({ type: 'text', nullable: false })
  lastName!: string;

  @Column({ type: "timestamp with time zone" })
  birthDate!: Date;
  age!: number;
  @AfterLoad()
  getAge(): void {
    this.age = ((new Date()).getTime() - this.birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
  }

  @Column({ type: 'text', nullable: false })
  country!: string;

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE', primary: true })
  @JoinColumn({ name: 'userId' })
  user: User;
  @Column({ name: 'userId' })
  userId: string;

  @OneToMany(() => MotherContract, contract => contract.modelConnection)
  contractsWithMotherAgenciesConnection: Promise<MotherContract | null>;

  @OneToMany(() => ModelingContract, contract => contract.modelConnection)
  contractsWithModelingAgenciesConnection: Promise<ModelingContract | null>;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;
}
