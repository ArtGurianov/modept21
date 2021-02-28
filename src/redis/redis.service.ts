import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClientOpts, createClient, RedisClient } from 'redis';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class RedisService {
  private readonly client: RedisClient;

  constructor(private readonly configService: ConfigService) {
    const url = this.configService.get<string>('redisUrl');
    if (!url) {
      throw new InternalServerErrorException('cannot find redis config url')
    }
    this.client = createClient({url} as ClientOpts);
  }

  public async set(
    key: string,
    value: string,
    time?: number,
    //expiryMode?: string | any[],
    //setMode?: number | string,
  ): Promise<boolean> {
    if (time) {
      return await this.client.set(key, value, 'EX', time);
    }
    return await this.client.set(key, value);
  }

  public async get(key: string): Promise<boolean> {
    return await this.client.get(key);
  }

  public async del(key: string): Promise<boolean> {
    return await this.client.del(key);
  }
}
