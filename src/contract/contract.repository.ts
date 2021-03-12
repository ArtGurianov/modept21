import { EntityRepository, Repository } from 'typeorm';
import { Contract } from './contract.entity';

@EntityRepository(Contract)
export class ContractRepository extends Repository<Contract> {}
