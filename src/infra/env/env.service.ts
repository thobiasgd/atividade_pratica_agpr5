import { Injectable } from '@nestjs/common';
import { Env } from './env';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<Env, true>) {}

  get<K extends keyof Env>(key: K): Env[K] {
    const value = this.configService.get(key, { infer: true });

    if (value === undefined) {
      throw new Error(`Missing environment variable: ${String(key)}`);
    }

    return value as Env[K];
  }
}
