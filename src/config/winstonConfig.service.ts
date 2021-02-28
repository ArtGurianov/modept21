import { Injectable } from '@nestjs/common';
import {
  WinstonModuleOptions,
  WinstonModuleOptionsFactory,
} from 'nest-winston';
import { format, transports } from 'winston';

@Injectable()
export class WinstonConfigService implements WinstonModuleOptionsFactory {
  //public constructor(private readonly configService: ConfigService) {}
  createWinstonModuleOptions(): WinstonModuleOptions {
    return {
      exitOnError: false,
      level: 'debug',
      levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6,
      },
      transports: [
        new transports.Console({
          format: format.combine(
            format.splat(),
            format.simple(),
            format.colorize({ message: true }),
            format.printf(this.consoleLoggerFormat),
          ),
        }),
      ],
    };
  }
  public consoleLoggerFormat(info: any): string {
    const tzoffset: number = new Date().getTimezoneOffset() * 60000;
    const localISOTime: string = new Date(Date.now() - tzoffset)
      .toISOString()
      .slice(0, -1);
    const level = format.colorize(info.level.toUpperCase());
    const context: string = info.context ? info.context : 'N/D';
    const msg = format.colorize(info.message ? info.message : '');

    return `${localISOTime} ${level.options} [${context}] ${msg.options}`;
  }
}
