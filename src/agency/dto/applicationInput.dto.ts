import {
  IsEmail,
  IsString,
} from 'class-validator';
import { Application } from '../application.entity';

export class ApplicationInputDto implements Partial<Application> {
  @IsString()
  @IsEmail()
  creatorEmail: string;

  @IsString()
  name: string;

  @IsString()
  vat: string;

  @IsString()
  country: string;
}
