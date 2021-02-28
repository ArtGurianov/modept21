import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { userTypesMap } from '../utils/maps/entityMap';
import { UserResultType } from '../types/resultTypes';
import { UserTypes } from '../types/userTypes.enum';

@Injectable()
export class UserService {
  public constructor(
    @InjectConnection() readonly connection: Connection,
    @InjectRepository(UserRepository)
    private readonly userRepo: UserRepository,
  ) {}

  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepo.find();
    if (users) {
      return users;
    } else {
      throw new ServiceUnavailableException(
        'Ohhh.. Could not process operation.',
      );
    }
  }

  async me(userId: string, userType: UserTypes): Promise<UserResultType> {
    const userTypeEntity = await this.connection
      .getRepository(userTypesMap[userType])
      .findOne({ where: { userId }, relations: ["user"]});
    if (!userTypeEntity) {
      throw new UnauthorizedException('cant find yourself');
    }
    return userTypeEntity;
  }
}
