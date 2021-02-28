import {
  Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booker2AgencyRepository } from '../../agency/booker2agency.repository';
import { JwtService } from '../../jwt/jwt.service';
import { Response } from 'express';
import { UserRepository } from '../user.repository';
import { BookerRoles } from '../../types/bookerRoles.enum';

@Injectable()
export class BookerService {
  public constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserRepository)
    private readonly userRepo: UserRepository,
    @InjectRepository(Booker2AgencyRepository)
    private readonly b2aRepo: Booker2AgencyRepository,
  ) {}


  async promoteBooker(agencyId: string, promoterId: string, bookerId: string): Promise<boolean> {

    const b2aBookerRecord = await this.b2aRepo.findOne({agencyId, bookerId});
    if (!b2aBookerRecord) {
      throw new NotFoundException("booker doesnt work in this agency.");
    }

    const saved = await this.b2aRepo.save({...b2aBookerRecord, bookerRole: BookerRoles.HEAD_BOOKER, promotedBy: promoterId});
    if (!saved) {
      throw new InternalServerErrorException("cannot change booker-agency record.")
    }

    return true;
  }

  async demoteHeadBooker(agencyId: string, demoterId: string, bookerId: string): Promise<boolean> {

    const b2aBookerRecord = await this.b2aRepo.findOne({agencyId, bookerId});
    if (!b2aBookerRecord) {
      throw new NotFoundException("booker doesnt work in this agency.");
    }

    const saved = await this.b2aRepo.save({...b2aBookerRecord, bookerRole: BookerRoles.BASIC_BOOKER ,demotedBy: demoterId});
    if (!saved) {
      throw new InternalServerErrorException("cannot change booker-agency record.")
    }

    return true;
  }

  async activateBooker(agencyId: string, activatorId: string, bookerId: string): Promise<boolean> {

    const b2aBookerRecord = await this.b2aRepo.findOne({agencyId, bookerId});
    if (!b2aBookerRecord) {
      throw new NotFoundException("booker doesnt work in this agency.");
    }

    const saved = await this.b2aRepo.save({...b2aBookerRecord, isActive: true, activatedBy: activatorId});
    if (!saved) {
      throw new InternalServerErrorException("cannot change booker-agency record.")
    }

    return true;

  }

  async deactivateBooker(agencyId: string, deactivatorId: string, bookerId: string): Promise<boolean> {

    const b2aBookerRecord = await this.b2aRepo.findOne({agencyId, bookerId});
    if (!b2aBookerRecord) {
      throw new NotFoundException("booker doesnt work in this agency.");
    }

    const saved = await this.b2aRepo.save({...b2aBookerRecord, isActive: false, deactivatedBy: deactivatorId});
    if (!saved) {
      throw new InternalServerErrorException("cannot change booker-agency record.")
    }

    return true;

  }

  async switchAgency(res: Response, userId: string, agencyId: string): Promise<string> {
    const user = await this.userRepo.findOne({id: userId});
    if (!user) {
      throw new UnauthorizedException("there is no such booker.");
    }
    const b2a = await this.b2aRepo.findOne({ bookerId: userId, agencyId});
    if (!b2a) {
      throw new UnauthorizedException("you dont belong to this agency.");
    }
    const {accessToken, refreshToken} = this.jwtService.issueTokens({userId: user.id, userType: user.userType, userTypeRole: b2a.bookerRole, agencyId: b2a.agencyId , tokenVersion: user.tokenVersion});
    res.cookie('jid', refreshToken, {
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
      path: '/user/refresh',
    });
    return accessToken;
  }

}
