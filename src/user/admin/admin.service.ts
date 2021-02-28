import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AdminRoles } from '../../types/adminRoles.enum';
import { UserTypes } from '../../types/userTypes.enum';
import { defaultInsecureKey } from '../../utils/constants';
import { UserRepository } from '../user.repository';
import { AdminRepository } from './admin.repository';

@Injectable()
export class AdminService {
  public constructor(
    @InjectConnection() readonly connection: Connection,
    @InjectRepository(UserRepository)
    private readonly userRepo: UserRepository,
    @InjectRepository(AdminRepository)
    private readonly adminRepo: AdminRepository,
    private readonly configService: ConfigService,
  ) {}

  async injectSuperAdmin(): Promise<string> {
    const superAdminEmail = this.configService.get<string>(
      'superAdminEmail',
      defaultInsecureKey,
    );
    const superAdmin = await this.userRepo.findOne({
      email: superAdminEmail,
    });

    if (superAdmin) return superAdmin.id;

    const newUser = await this.userRepo.create({
      email: superAdminEmail,
      userType: UserTypes.ADMIN,
      password: this.configService.get<string>(
        'superAdminPassword',
        defaultInsecureKey,
      ),
    });
    if (!newUser)
      throw new InternalServerErrorException('could not create user record');

    const newSuperAdmin = await this.adminRepo.save({ user: newUser, adminRole: AdminRoles.SUPER_ADMIN });
    if (!newSuperAdmin)
      throw new InternalServerErrorException('could not create admin record');

    return newSuperAdmin.id;
  }

}
