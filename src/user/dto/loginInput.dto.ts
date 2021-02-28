import { IsEmail, IsString } from 'class-validator';
import { User } from '../user.entity';

export class LoginInputDto implements Partial<User> {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
