import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DataSource } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { runSeeders } from 'typeorm-extension'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const dataSource = app.get(DataSource)
  const configService = app.get(ConfigService)

  if (configService.get('ENABLE_SEED') === 'true') {
    await runSeeders(dataSource)
  }

  await app.listen(3000)
}
bootstrap()
