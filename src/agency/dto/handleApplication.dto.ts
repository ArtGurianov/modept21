import {
  IsString,
} from 'class-validator';
import { Application } from '../application.entity';

export class HandleApplicationDto implements Partial<Application> {
  @IsString()
  applicationId: string;

  @IsString()
  reviewerId: string;
}
