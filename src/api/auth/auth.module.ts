import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@entities/users.entity'
import { AuthService } from '@api/auth/auth.service'
import { UsersModule } from '@api/users/users.module'
import { AuthController } from '@api/auth/auth.controller'
import { AuthUserLoginGuard } from '@api/auth/guards/auth.guard'
import { AuthUserLoginStrategy } from '@strategies/auth.user.strategy'

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('SESSION_SECRET'),
        signOptions: { expiresIn: '30m' },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthUserLoginGuard, AuthUserLoginStrategy],
  exports: [AuthService],
})
export class AuthModule {}
