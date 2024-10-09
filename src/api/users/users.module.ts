import { Module } from '@nestjs/common'
import { UsersService } from '@api/users/users.service'
import { UsersController } from '@api/users/users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@entities/users.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
