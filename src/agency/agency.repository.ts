import { EntityRepository, Repository } from 'typeorm';
import { Agency } from './agency.entity';

@EntityRepository(Agency)
export class AgencyRepository extends Repository<Agency> {}
