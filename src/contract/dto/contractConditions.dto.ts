import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsString,
} from 'class-validator';
import { ContractConditions } from '../contractConditions.entity';

export class ContractConditionsDto implements Partial<ContractConditions> {

  @IsNumber()
  agencyCommissionPercent: number;

  @IsString()
  visaType: 'working' | 'business' | 'travel';

  @IsBoolean()
  flightCredit: boolean;

  @IsBoolean()
  apartmentCredit: boolean;

  @IsBoolean()
  pocketMoneyCredit: boolean;

  @IsString()
  guaranteeType: 'gross' | 'net';

  @IsNumber()
  guaranteeAmount: number;

  @IsString()
  additional: string;

  @IsDate()
  periodFrom: Date;

  @IsDate()
  periodTill: Date;

}
