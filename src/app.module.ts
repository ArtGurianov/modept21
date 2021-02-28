import Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgencyModule } from './agency/agency.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/appConfig';
import { TypeOrmConfigService } from './config/typeormConfig.service';
import { ContractModule } from './contract/contract.module';
import { JwtService } from './jwt/jwt.service';
import { UserModule } from './user/user.module';
import { ForbiddenExceptionFilter } from './utils/forbiddenException.filter';
import { AuthGuard } from './utils/guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid(
          'development',
          'test',
          'staging',
          'production',
        ),
        SERVER_PORT: Joi.number(),
        FRONTEND_HOST_URL: Joi.string(),
        JWT_ACCESS_SECRET: Joi.string(),
        JWT_REFRESH_SECRET: Joi.string(),
        SUPER_ADMIN_EMAIL: Joi.string(),
        SUPER_ADMIN_PASSWORD: Joi.string(),
        S3_BUCKET_URL: Joi.string(),
        S3_BUCKET_NAME: Joi.string(),
        AWS_ACCESS_KEY_ID: Joi.string(),
        AWS_SECRET_ACCESS_KEY: Joi.string(),
        AWS_REGION: Joi.string(),
        REDIS_URL: Joi.string(),
        DATABASE_URL: Joi.string(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    UserModule,
    AgencyModule,
    ContractModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_FILTER, useClass: ForbiddenExceptionFilter },
  ],
})
export class AppModule {}
