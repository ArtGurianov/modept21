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
  ): Promise<"OK" | undefined> {
    return new Promise<"OK" | undefined>((resolve, reject) => {
      this.client.set(key, value, 'EX', time=-1, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  }

  public async get(key: string): Promise<string | null> {
    return new Promise<string | null>((resolve, reject) => {
      this.client.get(key, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  }

  public async del(key: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.client.del(key, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  }
}
