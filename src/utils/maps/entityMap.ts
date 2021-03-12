import { Type } from '@nestjs/common';
import { ModelingContract } from '../../contract/contract.entity';
import { MotherContract } from '../../contract/motherContract.entity';
import { ContractTypes } from '../../types/contractTypes.enum';
import { UserTypes } from '../../types/userTypes.enum';
import { Admin } from '../../user/admin/admin.entity';
import { Booker } from '../../user/booker/booker.entity';
import { Model } from '../../user/model/model.entity';

type UserEntities = Admin | Booker | Model;
type ContractEntities = MotherContract | ModelingContract;

export const userTypesMap: Record<UserTypes, Type<UserEntities>> = {
  [UserTypes.ADMIN]: Admin,
  [UserTypes.BOOKER]: Booker,
  [UserTypes.MODEL]: Model,
};

export const contractTypesMap: Record<ContractTypes, Type<ContractEntities>> = {
  [ContractTypes.MOTHER]: MotherContract,
  [ContractTypes.MODELING]: ModelingContract,
}