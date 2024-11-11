import { DateProperty, NumProperty, StringProperty } from '@decorators/property.decorators'
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class User extends BaseEntity {
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

  @Column({ type: 'varchar', length: 255, nullable: true })
  @StringProperty()
  refreshToken: string

  @CreateDateColumn({ type: 'timestamp' })
  @DateProperty()
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  @DateProperty()
  updatedAt: Date

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @DateProperty()
  deletedAt: Date
}
