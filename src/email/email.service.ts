import {
  Injectable, InternalServerErrorException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import * as nodemailer from "nodemailer";
import { ConfigService } from '@nestjs/config';
import { EmailDataDto } from './dto/emailData.dto';
import { Queue } from 'bull';

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
    @InjectQueue('email') private emailQueue: Queue,
  ) {
    const emailConfig = this.configService.get<MailerEnv>('mailer');
    if (!emailConfig) {
      throw new InternalServerErrorException('cannot resolve email config.');
    }
    const {host, port, apiKey} = emailConfig;
    
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
    await this.emailQueue.add('sendEmailJob', emailDataDto, {removeOnComplete: true});
    return true;
  }
  
  async sendEmail(emailDataDto: EmailDataDto): Promise<boolean> {
    await this.emailTransporter.sendMail(emailDataDto);
    return true;
  }

}