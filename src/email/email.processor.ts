import { Processor, Process } from '@nestjs/bull';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EmailService } from './email.service';
import { Job } from 'bull';

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(
    private readonly emailService: EmailService,
  ) {}

  @Process('sendEmailJob')
  async sendEmail(job: Job): Promise<boolean> {
    const success = await this.emailService.sendEmail(job.data);
    if (!success) {
      throw new InternalServerErrorException('crashed at processing email queue.');
    }
    this.logger.log('email sent!');
    return true;
  }
}