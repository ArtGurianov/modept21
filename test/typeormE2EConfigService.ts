import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

import connOpts from './typeormE2EConnectionOptions';

export class TypeOrmE2EConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      ...connOpts,
      keepConnectionAlive: true,
    };
  }
}
