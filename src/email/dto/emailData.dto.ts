import {
  IsEmail,
  IsString,
} from 'class-validator';

export class EmailDataDto {
  @IsString()
  @IsEmail()
  from: string;

  @IsString()
  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  text: string;

  @IsString()
  html: string;
}
