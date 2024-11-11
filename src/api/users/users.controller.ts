import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { UsersService } from '@api/users/users.service'
import { CreateUserDto } from '@api/users/dto/create-user.dto'
import { UpdateUserDto } from '@api/users/dto/update-user.dto'
import { AuthUserGuard } from '@src/api/auth/guards/auth.guard'

@Controller('/api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AuthUserGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Get()
  @UseGuards(AuthUserGuard)
  findAll() {
    return this.usersService.findAll()
  }

  @Get(':id')
  @UseGuards(AuthUserGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id)
  }

  @Patch(':id')
  @UseGuards(AuthUserGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto)
  }

  @Delete(':id')
  @UseGuards(AuthUserGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id)
  }
}
