import { IsBoolean, IsString } from "class-validator";
import { AdminRoles } from "../../types/adminRoles.enum";
import { BookerRoles } from "../../types/bookerRoles.enum";

export class CreateAccessTokenDto {
  @IsString()
  userId: string;

  @IsString()
  userType: string;

  @IsString()
  agencyId?: string;

  @IsBoolean()
  userTypeRole?: AdminRoles | BookerRoles;
}