import { URL } from 'url';

export interface RedisConfig {
  host: string,
  port: number,
  db: number,
  password?: string,
}

export const parseRedisUrl = (url: string): RedisConfig => {
  const parsedUrl = new URL(url);
  if (!parsedUrl) {
    throw new Error('invalid url string');
  }
  return {
    host: parsedUrl.hostname || 'localhost',
    port: Number(parsedUrl.port || 6379),
    db: Number((parsedUrl.pathname || '/0').substr(1)) || 0,
    password: parsedUrl.password ? decodeURIComponent(parsedUrl.password) : undefined,
  }
};