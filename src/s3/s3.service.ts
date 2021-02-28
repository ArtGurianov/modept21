import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  PayloadTooLargeException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { RedisService } from '../redis/redis.service';
import { REDIS_PREFIXES } from '../types/redisPrefixes.enum';
import { MiB } from '../utils/constants';
import { v4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { FileRepository } from '../file/file.repository';

@Injectable()
export class S3Service {
  private readonly s3Storage: S3;
  
  public constructor(
    @InjectRepository(FileRepository)
    private readonly fileRepo: FileRepository,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.s3Storage = new S3({
      signatureVersion: 'v4',
      region: 'eu-central-1', //region should come from env
      accessKeyId: configService.get<string>(
        'awsAccessKeyId'
      ),
      secretAccessKey: configService.get<string>(
        'awsSecretAccessKey'
      ),
    });
  }

  async signS3(
    userId: string,
    mimeType: string,
    fileSizeBytes: number,
  ): Promise<string> {
    const allowedMimeTypes = ['application/pdf', 'image/jpeg'];
    if (fileSizeBytes > 100 * MiB) {
      throw new PayloadTooLargeException('file is too big');
    }

    if (!allowedMimeTypes.includes(mimeType)) {
      throw new NotAcceptableException('unsupported file format');
    }

    const alreadySigned = await this.redisService.get(
      `${REDIS_PREFIXES.UPLOAD_S3}${userId}`,
    );
    if (alreadySigned) {
      await this.redisService.del(`${REDIS_PREFIXES.UPLOAD_S3}${userId}`);
    };

    const mimeTypeParts = mimeType.split('/');
    const s3FilePath = `${mimeTypeParts[0]}/${v4()}.${mimeTypeParts[1]}`;
    const presignedUrl = await this.s3Storage.getSignedUrl('putObject', {
      ACL: 'public-read',
      Bucket: this.configService.get<string>(
        's3BucketName'
      ),
      Key: s3FilePath,
      Expires: 60, // seconds
      ContentType: mimeType,
    });

    if (!presignedUrl) {
      throw new InternalServerErrorException('cannot get presigned url');
    }

    await this.redisService.set(
      `${REDIS_PREFIXES.UPLOAD_S3}${userId}`,
      s3FilePath,
      60 * 10,
    );

    return presignedUrl;
  }

  async saveFile(userId: string, s3FilePath: string): Promise<boolean> {
    const redisValue = await this.redisService.get(
      `${REDIS_PREFIXES.UPLOAD_S3}${userId}`,
    );
    if (!redisValue) {
      throw new NotFoundException('expired uploading.');
    }

    await this.redisService.del(`${REDIS_PREFIXES.UPLOAD_S3}${userId}`);

    if (redisValue !== s3FilePath) {
      throw new ConflictException('invalid url.');
    }
    const mimeType = s3FilePath.split('/')[0];
    const newFile = await this.fileRepo.save({uploadedByUserId: userId, mimeType, s3FilePath});
    if (!newFile) {
      throw new InternalServerErrorException('could not create file object');
    }
    return true;
  }
}
// TODO: Should File contain the "category" field? "avatar", "book", "snapshot"? probably not?
