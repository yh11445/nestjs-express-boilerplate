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
    configService: ConfigService,
    private readonly usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('SESSION_SECRET'),
      ignoreExpiration: false,
    })
  }

  async validate(payload: { email: string }, done: VerifiedCallback): Promise<any> {
    const { email } = payload
    const user = await this.usersService.findByEmail(email)
    if (!user) {
      return done(new UnauthorizedException('User not found'), false)
    }
    return done(null, user)
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
      return done(new UnauthorizedException('Invalid email or password'), false)
    }

    const isPasswordValid = await hashCheck(password, user.password)
    if (!isPasswordValid) {
      return done(new UnauthorizedException('Invalid email or password'), false)
    }

    return done(null, user)
  }
}
