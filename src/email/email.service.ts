import {
  Injectable,
} from '@nestjs/common';
import * as nodemailer from "nodemailer";
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import { EmailDataDto } from './dto/emailData.dto';

interface MailerEnv {
  host: string;
  port: number;
  apiKey: string;
}

@Injectable()
export class EmailService {
  private readonly emailTransporter: nodemailer.Transporter;

  public constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    const {host, port, apiKey} = this.configService.get<MailerEnv>('mailer', {host: 'NotProvided', port: -1, apiKey: 'NotProvided'});
    this.emailTransporter = nodemailer.createTransport({
      host,
      port,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "apikey", // generated ethereal user
        pass: apiKey, // generated ethereal password
        }
      });
  }

  async pushToEmailQueue(emailDataDto: EmailDataDto): Promise<boolean> {
    return true;
  }
  
  async sendEmail(emailDataDto: EmailDataDto): Promise<boolean> {
    await this.emailTransporter.sendMail(emailDataDto);
    return true;
  }

}