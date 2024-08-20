import { StringProperty } from '@common/decorators/property.decorators'

export class AuthLoginDto {
  @StringProperty()
  email: string

  @StringProperty()
  password: string
}
