import { Module } from '@nestjs/common'
import { UsersService } from '@api/users/users.service'
import { UsersController } from '@api/users/users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Users } from '@entities/users.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
