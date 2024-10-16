import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger'
import { applyDecorators } from '@nestjs/common'

export const ApiCommonResponse = (obj: any) => {
  return applyDecorators(ApiExtraModels(obj), ApiOkResponse({ schema: { properties: { data: { $ref: getSchemaPath(obj) } } } }))
}
export const ApiCommonArrayResponse = (obj: any) => {
  return applyDecorators(
    ApiExtraModels(obj),
    ApiOkResponse({ schema: { properties: { data: { type: 'array', items: { $ref: getSchemaPath(obj) } } } } })
  )
}
