import { EntityRepository, Repository } from 'typeorm';
import { MotherContract } from './motherContract.entity';

@EntityRepository(MotherContract)
export class MotherContractRepository extends Repository<MotherContract> {}
