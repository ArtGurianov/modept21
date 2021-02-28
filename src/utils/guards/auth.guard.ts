import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Booker2AgencyRepository } from '../../agency/booker2agency.repository';
import { JwtService } from '../../jwt/jwt.service';
import { AdminRoles } from '../../types/adminRoles.enum';
import { AuthTypes } from '../../types/authTypes.enum';
import { BookerRoles } from '../../types/bookerRoles.enum';
import { JwtPayload } from '../../types/jwtPayload';
import { UserTypes } from '../../types/userTypes.enum';
import { fakeUserTypesMap } from '../maps/fakeAuthIdMap';
import { fakeAgencyId } from '../fakeIds';

const BEARER_PREFIX = `${ AuthTypes.Bearer } `;
const FAKE_AUTH_PREFIX = `${ AuthTypes.FakeAuth } `;
const USER_TYPES_STRINGS = Object.values( UserTypes );
const USER_TYPES_ROLES_STRINGS = { ...Object.values(AdminRoles), ...Object.values(BookerRoles) };
const FAKE_AUTH_ENVS = [ 'development', 'test' ];
//example of fake auth: FakeAuth BOOKER BASIC_BOOKER
//or: FakeAuth ADMIN MODERATOR_ADMIN

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(
    @InjectRepository( Booker2AgencyRepository )
    private readonly b2aRepo: Booker2AgencyRepository,
    private readonly reflector: Reflector,
    @Inject( 'JwtService' ) private readonly jwtService: JwtService,
    @Inject( 'ConfigService' ) private readonly configService: ConfigService,
  ) {}

  async canActivate( context: ExecutionContext ): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest();

    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException(
        'No auth header included in your request!',
      );
    }

    let jwtPayload: JwtPayload | null = null;

    const nodeEnv = this.configService.get<string>('nodeEnv');
    if (
      nodeEnv &&
      FAKE_AUTH_ENVS.includes(nodeEnv) &&
      authHeader.startsWith(FAKE_AUTH_PREFIX)
    ) {
      const authHeaderValues = authHeader.split(' ');
      const passedUserType = authHeaderValues[1];
      const passedUserTypeRole = authHeaderValues[2];
      if (!USER_TYPES_STRINGS.includes(passedUserType)) {
        throw new UnauthorizedException(`incorrect type: ${passedUserType}`);
      }
      if (!USER_TYPES_ROLES_STRINGS.includes(passedUserTypeRole)) {
        throw new UnauthorizedException(`incorrect role: ${passedUserTypeRole}`);
      }
      const userType: UserTypes = passedUserType;
      const userTypeRole: AdminRoles | BookerRoles = passedUserTypeRole;
      const agencyId = userType === UserTypes.BOOKER ? fakeAgencyId : 'void';
      jwtPayload = {userId: fakeUserTypesMap[userType][userTypeRole], userType, userTypeRole, agencyId, iat: -1, exp: -1}
       
    } else if (authHeader.startsWith(BEARER_PREFIX)) {
      const token = authHeader.slice(BEARER_PREFIX.length);
      const parsedJwt = this.jwtService.verifyAccessToken(token);
      if (!parsedJwt) {
        throw new UnauthorizedException('Invalid jwt!');
      }
      jwtPayload = {userId: parsedJwt.userId, userType: parsedJwt.userType, userTypeRole: parsedJwt.userTypeRole, agencyId: 'void', iat: parsedJwt.iat, exp: parsedJwt.exp}
      if (parsedJwt.agencyId !== 'void') {
        const b2aRecord = await this.b2aRepo.findOne({bookerId: parsedJwt.userId, agencyId: parsedJwt.agencyId});
        if (!b2aRecord) {
          throw new UnauthorizedException();
        }
        jwtPayload.agencyId = b2aRecord.agencyId;
        jwtPayload.userTypeRole = b2aRecord.bookerRole;
      }

    } else {
      throw new UnauthorizedException('Incorrect auth header format');
    }

    const allowedUserTypes = this.reflector.get<string[]>(
      'allowedUserTypes',
      context.getHandler(),
    );
    
    if (!jwtPayload) {
      throw new UnauthorizedException("You don't have permission to access this resource");
    }
    if (
      !allowedUserTypes ||
      !allowedUserTypes.length ||
      allowedUserTypes.includes(jwtPayload.userType)
    ) {
      req.jwtPayload = jwtPayload;
      return true;
    }
    throw new UnauthorizedException(
      "You don't have permission to access this resource",
    );
  }
}

//TODO: add allowed admin roles logic.