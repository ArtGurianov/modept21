import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookerRepository } from '../user/booker/booker.repository';
import { AgencyController } from './agency.controller';
import { AgencyRepository } from './agency.repository';
import { AgencyService } from './agency.service';
import { ApplicationRepository } from './application.repository';
import { Booker2AgencyRepository } from './booker2agency.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ApplicationRepository,
      AgencyRepository,
      BookerRepository,
      Booker2AgencyRepository
    ]),
  ],
  providers: [AgencyService],
  controllers: [AgencyController],
})
export class AgencyModule {}
