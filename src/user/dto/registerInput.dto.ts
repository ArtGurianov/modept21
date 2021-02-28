import {
  IsEmail,
  IsIn,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserTypes } from '../../types/userTypes.enum';
import { User } from '../user.entity';

const userTypesObj = { ...UserTypes };
const { ADMIN, ...registerTypesObj } = userTypesObj;
const registerTypes = Object.values(registerTypesObj);

export class RegisterInput implements Partial<User> {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @IsString()
  @IsIn(registerTypes, { message: 'cannot register with spicified User Type' })
  userTypes: UserTypes;
}
