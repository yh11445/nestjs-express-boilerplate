import { applyDecorators } from '@nestjs/common'
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsDate, IsNumber, IsObject, IsString, isEmpty } from 'class-validator'

export const NumTransform = () => Transform(({ value }) => (isEmpty(value) ? undefined : Number(value)))

export const NumProperty = (options?: ApiPropertyOptions) => {
  return applyDecorators(ApiProperty(options), NumTransform(), IsNumber())
}
export const StringProperty = (options?: ApiPropertyOptions) => {
  return applyDecorators(ApiProperty(options), IsString())
}
export const BooleanProperty = (options?: ApiPropertyOptions) => {
  return applyDecorators(
    ApiProperty(options),
    Transform(({ value }) => (value === 'true' ? true : value == true ? true : false)),
    IsString()
  )
}
export const DateProperty = (options?: ApiPropertyOptions) => {
  return applyDecorators(ApiProperty(options), IsDate())
}
export const ObjectProperty = (options?: ApiPropertyOptions) => {
  return applyDecorators(ApiProperty(options), IsObject())
}
