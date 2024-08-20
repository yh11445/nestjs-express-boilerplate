import { Users } from '@entities/users.entity'
import { DataSource } from 'typeorm'
import { Seeder } from 'typeorm-extension'
import { hashMake } from '@utils/hash.util'

export class UsersSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Users)
    const existingUser = await repository.findOne({ where: { email: 'admin@admin.com' } })
    if (existingUser) {
      console.log('Admin user already exists')
      return
    }

    const hashedPassword = await hashMake('admin')
    const entity = {
      name: 'admin',
      email: 'admin@admin.com',
      password: hashedPassword,
    }

    await repository.save(entity)
  }
}
