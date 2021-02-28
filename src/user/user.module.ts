import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '../jwt/jwt.service';
import { AdminModule } from './admin/admin.module';
import { AdminRepository } from './admin/admin.repository';
import { BookerRepository } from './booker/booker.repository';
import { CustomerRepository } from './customer/customer.repository';
import { DistributorRepository } from './distributor/distributor.repository';
import { ManufacturerRepository } from './manufacturer/manufacturer.repository';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      AdminRepository,
      BookerRepository
    ]),
    AdminModule,
  ],
  providers: [UserService, JwtService, ConfigService],
  controllers: [UserController],
})
export class UserModule {}
