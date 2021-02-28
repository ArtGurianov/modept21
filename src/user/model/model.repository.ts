import { EntityRepository, Repository } from 'typeorm';
import { Model } from './model.entity';

@EntityRepository(Model)
export class ModelRepository extends Repository<Model> {}
