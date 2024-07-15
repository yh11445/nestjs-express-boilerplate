import { HttpException } from '@nestjs/common'
import { ValidationError, validate } from 'class-validator'

export class ValidationObjectException extends HttpException {
  constructor(obj: { [key: string]: string[] }) {
    super(obj, 400)
  }
}

export const entityValidation = async <T extends object>(entity: T) => {
  const validationErrors = await validate(entity, { whitelist: true })
  if (validationErrors?.length > 0) throw new ValidationException(validationErrors)
  return entity
}
export class ValidationException extends HttpException {
  constructor(errors: ValidationError[]) {
    const errorObj = errors.reduce(
      (prev, { property, constraints }: any) => ((prev[property] = [Object.values(constraints || {}).join(',')]), prev),
      {}
    )
    super(errorObj, 400)
  }
}
export const getErrorMessage = (errors: ValidationError[]) => {
  return errors.reduce((prev, { property, constraints }: any) => ((prev[property] = [Object.values(constraints || {}).join(',')]), prev), {})
}
