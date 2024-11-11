import { Exclude, Expose } from 'class-transformer'

export class ResponseUserDto {
  @Expose()
  id: number

  @Expose()
  name: string

  @Expose()
  email: string

  @Exclude()
  password: string
}
