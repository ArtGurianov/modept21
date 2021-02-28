import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { ApplicationRepository } from './application.repository';
import { BookerRepository } from '../user/booker/booker.repository';
import { ApplicationStatuses } from '../types/applicationStatuses.enum';
import { Application } from './application.entity';
import { AgencyRepository } from './agency.repository';
import { Booker } from '../user/booker/booker.entity';
import { oneDayMs } from '../utils/constants';
import { ApplicationInputDto } from './dto/applicationInput.dto';
import { HandleApplicationDto } from './dto/handleApplication.dto';

@Injectable()
export class AgencyService {
  public constructor(
    @InjectConnection() readonly connection: Connection,
    @InjectRepository(BookerRepository)
    private readonly bookerRepo: BookerRepository,
    @InjectRepository(ApplicationRepository)
    private readonly applicationRepo: ApplicationRepository,
    @InjectRepository(AgencyRepository)
    private readonly agencyRepo: AgencyRepository,
  ) {}

  async newAgencyApplication(
    applicationInputDto: ApplicationInputDto
  ): Promise<boolean> {
    const alreadyExists = await this.applicationRepo.findOne({vat: applicationInputDto.vat});
    if (alreadyExists?.status === ApplicationStatuses.RESOLVED) {
      throw new ConflictException('agency already registered!');
    }
    if (alreadyExists?.status === ApplicationStatuses.PENDING) {
      throw new ConflictException('application already exists and still pending.');
    }
    if (alreadyExists?.status === ApplicationStatuses.REJECTED) {
      const diffTime = new Date().getMilliseconds() - alreadyExists.updatedAt.getMilliseconds();
      if (diffTime < oneDayMs) {
        throw new ConflictException(`too many requests! Please Apply again after ${ (oneDayMs - diffTime) / 1000 / 60 } minutes`);
      }
    }

    const newApplication = this.applicationRepo.save({...applicationInputDto})
    if (!newApplication) {
      throw new InternalServerErrorException('cannot create a new application.');
    }

    //TODO send email notification to application.creatorEmail
    return true;
  }

  async resolveApplication({applicationId, reviewerId}: HandleApplicationDto): Promise<boolean> {
    const application = await this.applicationRepo.findOne({id: applicationId});
    if (!application) {
      throw new NotFoundException('application not found.');
    }
    if (application.status !== ApplicationStatuses.PENDING) {
      throw new ConflictException('must be pending to resolve.');
    }

    const alreadyExists = await this.agencyRepo.findOne({vat: application.vat});
    if (alreadyExists) {
      throw new ConflictException('Agency already exists.');
    }

    const resolved = {...application, status: ApplicationStatuses.RESOLVED, reviewerId};
    const saved = await this.applicationRepo.save(resolved);
    if (!saved) {
      throw new InternalServerErrorException('cannot resolve application.');
    }

    const newAgencyCreated = await this.createAgency(saved);
    if (!newAgencyCreated) {
      throw new InternalServerErrorException('cannot create agency.');
    }

    //TODO send email notification to application.creatorEmail
    return true;
  }

  async rejectApplication({applicationId, reviewerId}: HandleApplicationDto, reviewerComment: string): Promise<boolean> {
    const application = await this.applicationRepo.findOne({id: applicationId});
    if (!application) {
      throw new NotFoundException('application not found.');
    }
    if (application.status !== ApplicationStatuses.PENDING) {
      throw new ConflictException('must be pending to reject.');
    }
    const rejected = {...application, status: ApplicationStatuses.REJECTED, reviewerComment, reviewerId};
    const saved = await this.applicationRepo.save(rejected);

    if (!saved) {
      throw new InternalServerErrorException('cannot resolve application.');
    }
    //TODO send email notification to application.creatorEmail
    return true;
  }

  async createAgency(application: Application): Promise<boolean> {
    let creator: Booker | undefined;
    creator = await this.bookerRepo.findOne({email: application.creatorEmail})
    if (!creator) {
      creator = await this.bookerRepo.save({email: application.creatorEmail})
    }
    if (!creator) {
      throw new InternalServerErrorException('cannot create user.');
    }

    const { 
      id,
      status, 
      reviewerId, 
      reviewerComment, 
      creatorEmail, 
      businessLicenseImageUrl, 
      createdAt, 
      updatedAt, 
      ...newAgencyData
    } = application;

    const savedAgency = this.agencyRepo.save({...newAgencyData, creatorId: creator.id});
    if (!savedAgency) {
      throw new InternalServerErrorException('cannot create a new agency.');
    }

    return true;
  }
}
