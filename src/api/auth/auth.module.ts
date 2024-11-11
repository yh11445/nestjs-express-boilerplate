import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@entities/users.entity'
import { AuthService } from '@api/auth/auth.service'
import { UsersModule } from '@api/users/users.module'
import { AuthController } from '@api/auth/auth.controller'
import { AuthUserGuard, AuthUserLoginGuard } from '@api/auth/guards/auth.guard'
import { AuthUserLoginStrategy, AuthUserStrategy } from '@strategies/auth.user.strategy'

@Module({
  imports: [ConfigModule, PassportModule, TypeOrmModule.forFeature([User]), JwtModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, AuthUserLoginGuard, AuthUserLoginStrategy, AuthUserGuard, AuthUserStrategy],
  exports: [],
})
export class AuthModule {}
