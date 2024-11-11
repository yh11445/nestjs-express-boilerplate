import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { finalize, Observable } from 'rxjs'
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
      if (maskedObj.image) {
        maskedObj.image = '****(base64 data)****'
      }
      return maskedObj
    }

    return next.handle().pipe(
      finalize(() => {
        const body = maskSensitiveData(req.body)
        const elapsedTime = Date.now() - now
        const logMessage = `
[${context.getClass().name}::${context.getHandler().name}]
----------------------------------------------------
IP Address       : ${ip}
User Agent       : ${userAgent}
Method           : ${req.method}
URL              : ${req.url}
Elapsed Time     : ${elapsedTime} ms
----------------------------------------------------
Query Parameters : ${JSON.stringify(req.query, null, 2)}
Body             : ${JSON.stringify(body, null, 2)}`
        this.logger.log(logMessage)
      })
    )
  }
}
