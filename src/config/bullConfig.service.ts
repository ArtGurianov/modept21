import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SharedBullConfigurationFactory, BullModuleOptions } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { parseRedisUrl } from '../utils/parseRedisUrl';

interface RedisConfig {
  host: string,
  port: number,
  db: number,
  password?: string,
}

@Injectable()
export class BullConfigService implements SharedBullConfigurationFactory {
  private readonly redisConfig: RedisConfig; 
  constructor(private readonly configService: ConfigService) {
    const redisUrl = this.configService.get<string>('redisUrl');
    if (!redisUrl) {
      throw new InternalServerErrorException('cannot resolve redis config');
    }
    const parsedUrl = parseRedisUrl(redisUrl);
    if (!parsedUrl) {
      throw new InternalServerErrorException('cannot parse redis url');
    }
    this.redisConfig = parsedUrl;
  }
  createSharedConfiguration(): BullModuleOptions {
    return {
      redis: this.redisConfig
    };
}
}