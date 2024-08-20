import { PickType } from '@nestjs/swagger'
import { Users } from '@entities/users.entity'

export class CreateUserDto extends PickType(Users, ['name', 'email', 'password']) {}
