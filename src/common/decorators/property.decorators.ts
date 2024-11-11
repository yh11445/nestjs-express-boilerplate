import { applyDecorators } from '@nestjs/common'
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsArray, IsBoolean, IsDate, IsNumber, IsObject, IsString, isEmpty } from 'class-validator'

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
    IsBoolean()
  )
}

export const DateProperty = (options?: ApiPropertyOptions) => {
  return applyDecorators(
    ApiProperty(options),
    Transform(({ value }) => new Date(value)),
    IsDate()
  )
}

export const ObjectProperty = (options?: ApiPropertyOptions) => {
  return applyDecorators(ApiProperty(options), IsObject())
}

export const ArrayProperty = (options?: ApiPropertyOptions) => {
  return applyDecorators(ApiProperty({ ...options, isArray: true }), IsArray())
}
