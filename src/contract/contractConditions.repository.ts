import { EntityRepository, Repository } from 'typeorm';
import { ContractConditions } from './contractConditions.entity';

@EntityRepository(ContractConditions)
export class ContractConditionsRepository extends Repository<ContractConditions> {}
