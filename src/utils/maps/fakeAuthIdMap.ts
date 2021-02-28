import { AdminRoles } from '../../types/adminRoles.enum';
import { BookerRoles } from '../../types/bookerRoles.enum';
import { ContractTypes } from '../../types/contractTypes.enum';
import { UserTypes } from '../../types/userTypes.enum';
import {fakeBasicAdminId, fakeBasicB2AId, fakeBasicBookerId, fakeHeadB2AId, fakeHeadBookerId,fakeModelingContractId, fakeModeratorId, fakeMotherContractId, fakeSuperAdminId} from '../fakeIds';

export const fakeBookerIdMap: Record<BookerRoles, string> = {
  [BookerRoles.BASIC_BOOKER]: fakeBasicBookerId,
  [BookerRoles.HEAD_BOOKER]: fakeHeadBookerId,
};

export const fakeAdminIdMap: Record<AdminRoles, string> = {
  [AdminRoles.SUPER_ADMIN]: fakeSuperAdminId,
  [AdminRoles.BASIC_ADMIN]: fakeBasicAdminId,
  [AdminRoles.MODERATOR_ADMIN]: fakeModeratorId,
};

export const fakeUserTypesMap: Record<Exclude<UserTypes, UserTypes.MODEL>, Record<any, string>> = {
  [UserTypes.BOOKER]: fakeBookerIdMap,
  [UserTypes.ADMIN]: fakeAdminIdMap,
}

export const fakeContractsIdMap: Record<ContractTypes, string> = {
  [ContractTypes.MOTHER]: fakeMotherContractId,
  [ContractTypes.MODELING]: fakeModelingContractId,
};

export const fakeB2AIdMap: Record<BookerRoles, string> = {
  [BookerRoles.BASIC_BOOKER]: fakeBasicB2AId,
  [BookerRoles.HEAD_BOOKER]: fakeHeadB2AId,
}