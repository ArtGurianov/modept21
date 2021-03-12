import {
  IsString,
} from 'class-validator';
import { Contract } from '../../contract/contract.entity';
import { ContractTypes } from '../../types/contractTypes.enum';

export class NewModelInvitationDto implements Partial<Contract> {
  @IsString()
  signedPdfLink: string;

  @IsString()
  email: string;

  @IsString()
  conditionsId: string;

  @IsString()
  agencyId: string;

  @IsString()
  bookerId: string;

  @IsString()
  contractType: ContractTypes;
}
