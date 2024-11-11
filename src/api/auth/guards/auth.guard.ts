import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class AuthUserGuard extends AuthGuard('auth:user') {
  handleRequest(err: any, user: any, info: Error) {
    if (err || !user) {
      if (info instanceof TokenExpiredError) {
        throw new UnauthorizedException({ message: 'Access token has expired', errorCode: 'ACCESS_TOKEN_EXPIRED' })
      } else if (info instanceof JsonWebTokenError) {
        throw new UnauthorizedException({ message: 'Invalid access token', errorCode: 'INVALID_ACCESS_TOKEN' })
      }
      throw info
    }
    return user
  }
}

@Injectable()
export class AuthUserLoginGuard extends AuthGuard('auth:user:login') {}
