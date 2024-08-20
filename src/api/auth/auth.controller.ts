import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { AuthService } from '@api/auth/auth.service'
import { AuthUserLoginGuard } from '@api/auth/guards/auth.guard'
import { AuthLoginDto } from '@api/auth/dto/auth.login.dto'
import { CreateUserDto } from '@api/users/dto/create-user.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthUserLoginGuard)
  async login(@Body() loginDto: AuthLoginDto) {
    return this.authService.login(loginDto)
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto)
  }
}
