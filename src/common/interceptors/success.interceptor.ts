import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Request } from 'express'
import { map, Observable } from 'rxjs'

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx: Request = context.switchToHttp().getRequest()
    const method = ctx.method.toUpperCase()
    if (method === 'DELETE' || method === 'PUT' || method === 'PATCH') {
      return next.handle().pipe(
        map((data) => {
          if (data?.affected) return { is_success: !!data?.affected }
          return data
        })
      )
    }
    return next.handle().pipe(map((data) => data))
  }
}
