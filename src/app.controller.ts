import { Controller, Get, Inject, LoggerService, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AppService } from './app.service';
import { Public } from './utils/decorators/public.decorator';

@ApiTags('app')
@Controller()
export class AppController implements OnApplicationBootstrap {
  constructor(private readonly appService: AppService, 
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
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
