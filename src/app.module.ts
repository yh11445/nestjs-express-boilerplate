import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from '@src/app.controller'
import { AppService } from '@src/app.service'
import { getEnvFilePath, typeOrmConfig } from './config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClsModule } from 'nestjs-cls'
import { ClsPluginTransactional } from '@nestjs-cls/transactional'
import { DataSource } from 'typeorm'
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm'
import { UsersModule } from './api/users/users.module'
import { AuthModule } from './api/auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: getEnvFilePath(), isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return typeOrmConfig(config)
      },
    }),
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [TypeOrmModule],
          adapter: new TransactionalAdapterTypeOrm({ dataSourceToken: DataSource }),
        }),
      ],
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
