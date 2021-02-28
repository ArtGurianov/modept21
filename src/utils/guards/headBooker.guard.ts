import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booker2AgencyRepository } from '../../agency/booker2agency.repository';
import { BookerRoles } from '../../types/bookerRoles.enum';
import { JwtPayload } from '../../types/jwtPayload';

@Injectable()
export class HeadBookerGuard implements CanActivate {
  public constructor(
    @InjectRepository(Booker2AgencyRepository)
    private readonly b2aRepo: Booker2AgencyRepository,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const req = context.switchToHttp().getRequest();

    const jwtPayload: JwtPayload | undefined = req.jwtPayload;

    if (!jwtPayload) {
      throw new UnauthorizedException('jwt data is not attached to request obj yet.')
    }

    const b2aRecord = await this.b2aRepo.findOne({agencyId: jwtPayload.agencyId, bookerId: jwtPayload.userId});
    if (!b2aRecord) {
      throw new NotFoundException("head booker doesnt work in this agency.");
    }
    if (!b2aRecord.isActive) {
      throw new ForbiddenException("it seems that you dont work in this agency anymore.")
    }
    if (b2aRecord.bookerRole !== BookerRoles.HEAD_BOOKER) {
      throw new ForbiddenException("only head booker has access.")
    }

    return true;
  }
}
