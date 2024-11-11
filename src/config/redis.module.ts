// src/config/redis.module.ts
import { Module, Global } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { createClient, RedisClientType } from 'redis'

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService): Promise<RedisClientType<Record<string, never>>> => {
        const redisClient = createClient({
          url: `redis://${configService.get<string>('REDIS_HOST')}:${configService.get<number>('REDIS_PORT')}`,
          password: configService.get<string>('REDIS_PASSWORD'),
        }) as RedisClientType<Record<string, never>>

        redisClient.on('error', (err) => {
          console.error('Redis connection error:', err)
        })

        redisClient.on('connect', () => {
          console.log('Redis connected successfully')
        })

        try {
          await redisClient.connect()
        } catch (err) {
          console.error('Redis connection failed:', err)
          throw err
        }

        return redisClient
      },
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
