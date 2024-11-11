import { HttpAdapterHost } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { CommonExceptionsFilter } from '@common/filters'
import { LoggingInterceptor, ResponseInterceptor } from '@common/interceptors'
import { ValidationError, ValidationPipe } from '@nestjs/common'
import { ValidationException } from '@common/exceptions'
import { ConfigService } from '@nestjs/config'
import helmet from 'helmet'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import csurf from 'csurf'

export async function middleware(app: NestExpressApplication) {
  const configService = app.get<ConfigService>(ConfigService)
  const httpAdapterHost = app.get(HttpAdapterHost)
  app.useGlobalFilters(new CommonExceptionsFilter(httpAdapterHost))
  app.useGlobalInterceptors(new ResponseInterceptor(), new LoggingInterceptor())
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true, // only required validator output
      validateCustomDecorators: true,
      exceptionFactory: (errors: ValidationError[]) => new ValidationException(errors),
    })
  )

  const SESSION_SECRET = configService.get('SESSION_SECRET') || 'a_secret_with_minimum_length_of_32_characters'
  const STATIC_LIST = []

  // handlebars
  STATIC_LIST.forEach((prefix) => app.useStaticAssets(join(__dirname, '..', 'public', prefix), { prefix: `/${prefix}` }))
  app.setBaseViewsDir(join(__dirname, '..', 'views'))
  app.setViewEngine('hbs')

  // cors
  app.enableCors({ origin: true, credentials: true, exposedHeaders: ['Authorization'] })

  // cookie & session
  // app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
  // app.use(cookieParser())

  // csrf
  // app.use(csurf())

  // body parser
  app.useBodyParser('json', { limit: '10mb' })

  // helmet
  app.use(helmet())

  // swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS-Express-Boilerplate API DOCS')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', name: 'JWT', in: 'header' })
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/api', app, document)
}
