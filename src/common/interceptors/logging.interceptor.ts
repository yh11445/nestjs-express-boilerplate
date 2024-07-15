import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { Observable, tap } from 'rxjs'
import { Request } from 'express'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name)

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest()
    const now = Date.now()
    const ip = req.ip
    const userAgent = req.headers['user-agent']

    const maskSensitiveData = (obj: any) => {
      const maskedObj = { ...obj }
      if (maskedObj.result_image) {
        maskedObj.result_image = '****(base64 data)****'
      }
      return maskedObj
    }

    return next.handle().pipe(
      tap(() => {
        const body = maskSensitiveData(req.body)
        this.logger.log(
          `\r\n[${context.getClass().name} ${context.getHandler().name}] ` +
            `elapsed_time: ${Date.now() - now} ms \r\n` +
            `ip:${ip} \r\n` +
            `${req.method} ${req.url} ` +
            JSON.stringify({
              query: req.query,
              body,
              userAgent,
            })
        )
      })
    )
  }
}
