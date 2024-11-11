import { HttpException } from '@nestjs/common'
import { ValidationError } from 'class-validator'

export class ValidationException extends HttpException {
  constructor(errors: ValidationError[] | string, errorCode: string = 'VALIDATION_ERROR') {
    let detailedMessage: string

    if (typeof errors === 'string') {
      // `errors`가 문자열인 경우
      detailedMessage = errors
    } else {
      // `errors`가 ValidationError[] 배열인 경우
      const errorObj = errors.reduce(
        (prev, { property, constraints }: ValidationError) => {
          const messages = constraints ? Object.values(constraints).join(', ') : 'Unknown validation error'
          prev[property] = [messages]
          return prev
        },
        {} as { [key: string]: string[] }
      )

      // 오류 메시지를 문자열로 변환
      detailedMessage = Object.entries(errorObj)
        .map(([property, messages]) => `${property}: ${messages.join(', ')}`)
        .join(' | ')
    }

    // message와 errorCode를 포함한 객체를 메시지로 포함하여 HttpException을 생성
    super({ message: detailedMessage, errorCode }, 400)
  }
}
