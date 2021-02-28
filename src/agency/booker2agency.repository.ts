import { EntityRepository, Repository } from 'typeorm';
import { Booker2Agency } from './booker2agency.entity';

@EntityRepository(Booker2Agency)
export class Booker2AgencyRepository extends Repository<Booker2Agency> {}
