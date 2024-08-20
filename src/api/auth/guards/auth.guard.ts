import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class AuthUserGuard extends AuthGuard('auth:user') {}

@Injectable()
export class AuthUserLoginGuard extends AuthGuard('auth:user:login') {}
