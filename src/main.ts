import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AppModule } from './app.module';
import { defaultInsecureKey } from './utils/constants';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10000, // limit each IP to 100 requests per windowMs
    }),
  );
  app.set('trust proxy', 1);

  const configService = app.get(ConfigService);
  app.enableCors({
    origin: configService.get<string>('frontendHostUrl', defaultInsecureKey),
    credentials: true,
  });
  app.enableShutdownHooks();

  if (configService.get<string>('nodeEnv', 'development') === 'development') {
    const options = new DocumentBuilder()
      .setTitle('Voicy API')
      .setDescription('')
      .setVersion('0.1')
      .build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('swagger', app, document);
  }

  await app.listen(
    configService.get<number>(
      'serverPort',
      configService.get<number>('serverPort', 8000),
    ),
  );
}
bootstrap();
