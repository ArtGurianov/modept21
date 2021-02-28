import { Controller, Get, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';
import { Public } from './utils/decorators/public.decorator';

@ApiTags('app')
@Controller()
export class AppController implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService,
    private readonly configService: ConfigService) {
    }

  async onApplicationBootstrap(): Promise<void> {
    const nodeEnv = this.configService.get<string>('nodeEnv');
    if (nodeEnv === 'development' || nodeEnv === 'test') {
      const created = await this.appService.injectFakeEntities();
      if (created) {
          this.logger.log(`Fake entities injected!`);
      }
    }
  }

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
