import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { TypeORMError } from 'typeorm'

@Catch(TypeORMError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  private logger = new Logger(TypeOrmExceptionFilter.name)
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()
    const req = ctx.getRequest()
    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    const responseBody = {
      method: req.method,
      path: req.url,
      code: exception.constructor.name,
      status: httpStatus,
      message: exception.sqlMessage,
      timestamp: new Date().toISOString(),
      errors: exception,
    }
    this.logger.error(exception)
    return httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
  }
}
