import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common'
import { AuthService } from '@api/auth/auth.service'
import { AuthUserLoginGuard } from '@api/auth/guards/auth.guard'
import { AuthLoginDto } from '@api/auth/dto/auth.login.dto'
import { Request } from 'express'
import { plainToInstance } from 'class-transformer'
import { ResponseUserDto } from '@src/api/users/dto/response-user.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthUserLoginGuard)
  async login(@Body() loginDto: AuthLoginDto, @Req() req: Request) {
    const userInfo = plainToInstance(ResponseUserDto, req.user)
    const { access_token, refresh_token } = await this.authService.login(loginDto)
    return { userInfo, access_token, refresh_token }
  }

  @Post('refresh')
  async refreshAccessToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshAccessToken(refreshToken)
  }
}
