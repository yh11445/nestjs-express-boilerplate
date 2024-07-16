import { PickType } from '@nestjs/swagger'
import { entityValidation } from '@src/common/exceptions'
import { Users } from '@src/entities/users.entity'
import { plainToInstance } from 'class-transformer'

export class CreateUserDto extends PickType(Users, ['name', 'email', 'password']) {
  public async toEntity<T>(entity: Partial<T>) {
    const clazz = plainToInstance(CreateUserDto, Object.assign(this, entity))
    return await entityValidation(clazz)
  }
}
