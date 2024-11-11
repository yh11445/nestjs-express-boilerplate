import { UsersService } from '@api/users/users.service'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async login(loginDto: any) {
    const user = await this.usersService.findByEmail(loginDto.email)
    const payload = { email: user.email, sub: user.id }

    const access_token = await this.createAccessToken(payload)
    const refresh_token = await this.createRefreshToken(payload)

    await this.usersService.updateRefreshToken(user.id, refresh_token)

    return { access_token, refresh_token }
  }

  async createAccessToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: '60m',
    })
  }

  async createRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '30d',
    })
  }

  async refreshAccessToken(oldRefreshToken: string) {
    try {
      const payload = this.jwtService.verify(oldRefreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      })

      const { exp, iat, ...restPayload } = payload
      const newAccessToken = await this.createAccessToken(restPayload)

      const refreshTokenExpiresIn = payload.exp - Math.floor(Date.now() / 1000)
      let newRefreshToken = oldRefreshToken

      // refreshToken의 exp가 7일 미만일 경우 재발급
      if (refreshTokenExpiresIn < 7 * 24 * 60 * 60) {
        newRefreshToken = await this.createRefreshToken(restPayload)
        await this.usersService.updateRefreshToken(payload.sub, newRefreshToken)
      }

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      }
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        throw new UnauthorizedException({ message: 'Refresh token has expired', errorCode: 'REFRESH_TOKEN_EXPIRED' })
      } else {
        throw new UnauthorizedException({ message: 'Invalid refresh token', errorCode: 'INVALID_REFRESH_TOKEN' })
      }
    }
  }
}
