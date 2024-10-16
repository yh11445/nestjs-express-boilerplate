import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { DataSourceOptions } from 'typeorm'
import { SeederOptions } from 'typeorm-extension'
import { join } from 'path'
import { ConfigService } from '@nestjs/config'
import * as fs from 'fs'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

export const typeORMConfig = (configService: ConfigService): TypeOrmModuleOptions & SeederOptions & DataSourceOptions => {
  const synchronize = configService.get('NODE_ENV') === 'local'
  const isSeedEnabled = configService.get('ENABLE_SEED') === 'true'

  return {
    type: 'mysql',
    host: configService.get('DATABASE_HOST'),
    port: +configService.get('DATABASE_PORT'),
    username: configService.get('DATABASE_USERNAME'),
    password: configService.get('DATABASE_PASSWORD'),
    database: configService.get('DATABASE_NAME'),
    entities: [join(__dirname, './../entities/**/*.entity{.ts,.js}')],
    migrations: [join(__dirname, './../database/migrations/*{.ts,.js}')],
    seeds: isSeedEnabled ? [join(__dirname, './../database/seeds/*{.ts,.js}')] : undefined,
    synchronize,
    logging: true,
    timezone: 'Z',
    extra: {
      connectionLimit: 300,
      charset: 'utf8mb4_general_ci',
    },
    retryAttempts: 5,
    retryDelay: 3000,
    maxQueryExecutionTime: 1000,
    namingStrategy: new SnakeNamingStrategy(),
    cache: configService.get('REDIS_HOST')
      ? {
          type: 'redis',
          options: {
            host: configService.get('REDIS_HOST'),
            port: +configService.get('REDIS_PORT'),
            password: configService.get('REDIS_PASSWORD'),
          },
        }
      : undefined,
    ssl:
      configService.get('NODE_ENV') === 'production'
        ? {
            ca: fs.readFileSync(configService.get('DATABASE_CA')),
            key: fs.readFileSync(configService.get('DATABASE_KEY')),
            cert: fs.readFileSync(configService.get('DATABASE_CERT')),
          }
        : undefined,
  }
}
