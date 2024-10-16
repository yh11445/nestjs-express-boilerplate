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
    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    const errorResponse = {
      error: {
        method: req.method,
        path: req.url,
        status: httpStatus,
        exceptionType: exception.constructor.name,
        message: exception.message,
        timestamp: new Date().toISOString(),
      },
    }
    this.logger.error(exception)
    return httpAdapter.reply(ctx.getResponse(), errorResponse, httpStatus)
  }
}
