import {
  Body,
  Controller, Post, Req
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserTypes } from '../types/userTypes.enum';
import { AllowedUserTypes } from '../utils/decorators/allowedUserTypes.decorator';
import { Request } from 'express';
import { ContractService } from './contract.service';
import { Conditions } from './conditions.entity';
import { NewModelInvitationDto } from '../user/model/dto/newModelInvitation.dto';

@ApiTags('contract')
@Controller('contract')
export class ContractController {
  constructor(
    private readonly contractService: ContractService
  ) {}

  @AllowedUserTypes(UserTypes.BOOKER)
  @Post('/sendNewModelInvitation')
  async sendNewModelInvitation(
    @Body('newModelInvitationDto') newModelInvitationDto: NewModelInvitationDto,
    @Req() { jwtPayload }: Request,
  ): Promise<boolean> {
    return await this.contractService.sendNewModelInvitation(newModelInvitationDto, jwtPayload!.agencyId, jwtPayload!.userId);
  }
  
  @AllowedUserTypes(UserTypes.BOOKER)
  @Post('/newMotherContract')
  async newMotherContract(
    @Body('modelId') modelId: string,
    @Body('conditions') conditions: Conditions,
    @Req() { jwtPayload }: Request,
  ): Promise<boolean> {
    return await this.contractService.newMotherContract(jwtPayload?.agencyId, jwtPayload?.userId, modelId, conditions);
  }
}
