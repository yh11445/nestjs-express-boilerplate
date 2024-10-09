import { CreateUserDto } from '@api/users/dto/create-user.dto'
import { UsersService } from '@api/users/users.service'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthLoginDto } from '@src/api/auth/dto/auth.login.dto'
import { hashMake } from '@utils/hash.util'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login(loginDto: AuthLoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email)
    const payload = { email: user.email, sub: user.id }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  async signup(createUserDto: CreateUserDto) {
    createUserDto.password = await hashMake(createUserDto.password)
    return this.usersService.create(createUserDto)
  }
}
