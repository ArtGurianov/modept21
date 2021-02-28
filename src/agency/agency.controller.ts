import {
  Body,
  Controller,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserTypes } from '../types/userTypes.enum';
import { baseValidationPipe } from '../utils/baseValidationPipe';
import { Public } from '../utils/decorators/public.decorator';
import { Request } from 'express';
import { AllowedUserTypes } from '../utils/decorators/allowedUserTypes.decorator';
import { AgencyService } from './agency.service';

import { ApplicationInputDto } from './dto/applicationInput.dto';

@ApiTags('agency')
@Controller('agency')
export class AgencyController {
  constructor(
    private readonly agencyService: AgencyService
  ) {}

  @Public()
  @Post('/newAgencyApplication')
  async newAgencyApplication(
    @Body('applicationInputDto', baseValidationPipe)
    applicationInputDto: ApplicationInputDto,
  ): Promise<boolean> {
    return await this.agencyService.newAgencyApplication(applicationInputDto);
  }

  @AllowedUserTypes(UserTypes.ADMIN)
  @Post('/resolveApplication')
  async resolveApplication(
    @Body('applicationId') applicationId: string,
    @Req() { jwtPayload }: Request
  ): Promise<boolean> {
    return await this.agencyService.resolveApplication({applicationId, reviewerId: jwtPayload!.userId})
  }

  @AllowedUserTypes(UserTypes.ADMIN)
  @Post('/rejectApplication')
  async rejectApplication(
    @Body('applicationId') applicationId: string,
    @Body('reviewerComment') reviewerComment: string,
    @Req() { jwtPayload }: Request
  ): Promise<boolean> {
    return await this.agencyService.rejectApplication({applicationId, reviewerId: jwtPayload!.userId}, reviewerComment)
  }
}
