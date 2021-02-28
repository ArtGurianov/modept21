import { AdminRoles } from './adminRoles.enum';
import { BookerRoles } from './bookerRoles.enum';
import { UserTypes } from './userTypes.enum';
export interface JwtPayload {
  //Mutable and Immutable flags are
  //showing whether we should doublecheck
  //those values in the DB since they could
  //have changed BY SOMEONE ELSE (not user self)
  userId: string; //immutable
  userType: UserTypes; //immutable
  userTypeRole?: AdminRoles | BookerRoles; //mutable
  agencyId?: string; //immutable (only self switch)
  tokenVersion?: number; //mutable
  iat: number;
  exp: number;
}
