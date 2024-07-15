import { Strategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthUserStrategy extends PassportStrategy(JwtStrategy, 'auth:user') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('SESSION_SECRET'),
      ignoreExpiration: false,
    })
  }

  async validate({ email }: { email: string }, done: VerifiedCallback): Promise<any> {
    const user = { email }
    return done(null, user)
  }
}

@Injectable()
export class AuthUserLoginStrategy extends PassportStrategy(Strategy, 'auth:user:login') {
  constructor() {
    super({ usernameField: 'email', password: 'password' })
  }

  async validate(email: string, password: string, done: VerifiedCallback): Promise<any> {
    console.log(email, password)
    const user = { email }
    return done(null, user)
  }
}
