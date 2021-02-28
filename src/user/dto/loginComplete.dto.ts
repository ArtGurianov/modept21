import { IsNumber, IsString } from 'class-validator';
import { AdminRoles } from '../../types/adminRoles.enum';
import { BookerRoles } from '../../types/bookerRoles.enum';
import { UserTypes } from '../../types/userTypes.enum';

export class LoginCompleteDto {
  @IsString()
  userId: string;

  @IsString()
  userType: UserTypes;

  @IsNumber()
  tokenVersion: number;

  @IsString()
  agencyId?: string;

  @IsString()
  userTypeRole?: BookerRoles | AdminRoles;
}
