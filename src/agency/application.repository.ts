import { EntityRepository, Repository } from 'typeorm';
import { Application } from './application.entity';

@EntityRepository(Application)
export class ApplicationRepository extends Repository<Application> {}
