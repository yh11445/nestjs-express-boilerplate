import { Strategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UsersService } from '@api/users/users.service'
import { hashCheck } from '@utils/hash.util'

@Injectable()
export class AuthUserStrategy extends PassportStrategy(JwtStrategy, 'auth:user') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
      ignoreExpiration: false,
    })
  }

  async validate(payload: any): Promise<any> {
    const user = await this.usersService.findOne(payload.sub)
    if (!user) {
      throw new UnauthorizedException({ message: 'User not found', errorCode: 'USER_NOT_FOUND' })
    }
    return user
  }
}

@Injectable()
export class AuthUserLoginStrategy extends PassportStrategy(Strategy, 'auth:user:login') {
  constructor(private readonly usersService: UsersService) {
    super({ usernameField: 'email', password: 'password' })
  }

  async validate(email: string, password: string, done: VerifiedCallback): Promise<any> {
    const user = await this.usersService.findByEmail(email)
    if (!user) {
      return done(new UnauthorizedException({ message: 'Invalid Login ID', errorCode: 'INVALID_LOGIN_ID' }), false)
    }

    const isPasswordValid = await hashCheck(password, user.password)
    if (!isPasswordValid) {
      return done(new UnauthorizedException({ message: 'Invalid password', errorCode: 'INVALID_PASSWORD' }), false)
    }

    return done(null, user)
  }
}
