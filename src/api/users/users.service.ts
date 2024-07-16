import { Injectable } from '@nestjs/common'
import { CreateUserDto } from '@api/users/dto/create-user.dto'
import { UpdateUserDto } from '@api/users/dto/update-user.dto'
import { Users } from '@src/entities/users.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private readonly repository: Repository<Users>) {}
  create(createUserDto: CreateUserDto) {
    return this.repository.save(createUserDto)
  }

  findAll() {
    return this.repository.find()
  }

  findOne(id: number) {
    return this.repository.findOneBy({ id })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.repository.update(id, updateUserDto)
  }

  remove(id: number) {
    return this.repository.delete(id)
  }
}
