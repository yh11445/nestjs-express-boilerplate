import { NumProperty, StringProperty } from '@decorators/property.decorators'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @NumProperty()
  id: number

  @Column()
  @StringProperty()
  name: string

  @Column()
  @StringProperty()
  email: string

  @Column()
  @StringProperty()
  password: string
}
