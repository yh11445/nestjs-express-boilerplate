import { PickType } from '@nestjs/swagger'
import { User } from '@entities/users.entity'

export class CreateUserDto extends PickType(User, ['name', 'email', 'password']) {}
