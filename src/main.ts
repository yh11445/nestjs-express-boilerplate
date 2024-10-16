import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DataSource } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { runSeeders } from 'typeorm-extension'
import { middleware } from '@src/app.middleware'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const dataSource = app.get(DataSource)
  const configService = app.get(ConfigService)

  if (configService.get('ENABLE_SEED') === 'true') {
    await runSeeders(dataSource)
  }

  await middleware(app)

  await app.listen(3000)
}
bootstrap()
