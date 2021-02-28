import { EntityRepository, Repository } from 'typeorm';
import { Booker } from './booker.entity';

@EntityRepository(Booker)
export class BookerRepository extends Repository<Booker> {}
