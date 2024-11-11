import { Logger, ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

@Catch()
export class CommonExceptionsFilter implements ExceptionFilter {
  private logger = new Logger(CommonExceptionsFilter.name)
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()
    const req = ctx.getRequest()
    const res = ctx.getResponse()
    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    const response = exception instanceof HttpException ? exception.getResponse() : {}
    const errorCode = (response as any)?.errorCode || 'INTERNAL_SERVER_ERROR'
    const ip = req.ip
    const userAgent = req.headers['user-agent']
    const authorization = req.headers['authorization'] || 'No Authorization Header'

    const maskSensitiveData = (obj: any) => {
      const maskedObj = { ...obj }
      if (maskedObj.ocrImage) {
        maskedObj.ocrImage = '****(base64 data)****'
      }
      return maskedObj
    }
    const errorResponse = {
      error: {
        method: req.method,
        path: req.url,
        httpStatus: httpStatus,
        errorCode: errorCode,
        message: exception.message,
        timestamp: new Date().toISOString(),
      },
    }

    this.logger.error(`${exception.message}\nStack: ${exception.stack}`)

    const body = maskSensitiveData(req.body)
    const logMessage = `
----------------------------------------------------
IP Address       : ${ip}
User Agent       : ${userAgent}
Authorization    : ${authorization}
Method           : ${req.method}
URL              : ${req.url}
----------------------------------------------------
Query Parameters : ${JSON.stringify(req.query, null, 2)}
Body             : ${JSON.stringify(body, null, 2)}`
    this.logger.error(logMessage)

    return httpAdapter.reply(res, errorResponse, httpStatus)
  }
}
