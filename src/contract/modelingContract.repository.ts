import { EntityRepository, Repository } from 'typeorm';
import { ModelingContract } from './modelingContract.entity';

@EntityRepository(ModelingContract)
export class ModelingContractRepository extends Repository<ModelingContract> {}
