import * as dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';
import appConfig from './appConfig';

dotenv.config();
const config = appConfig();

const connOpts: ConnectionOptions = {
  type: 'postgres',
  url: config.pgUrl,
  synchronize: false,
  dropSchema: false,
  logging: config.nodeEnv === 'development' ? true : false,
  //reading from
  entities: ['!(dist)/**/*.entity.[tj]s'],
  subscribers: ['!(dist)/subscribers/*.[tj]s'],
  migrations: ['!(dist)/migrations/*.[tj]s'],
  cli: {
    //generating to:
    migrationsDir: 'src/migrations',
    subscribersDir: 'src/migrations',
  },
};
export default connOpts;
