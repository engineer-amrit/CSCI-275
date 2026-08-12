import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'
import { ConfigService } from './infra/config/index.js'
import { appInit } from './app.init.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)
  app.enableCors({
    origin: config.isProduction ? true : false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204,
  })
  await appInit(app)
  await app.listen(3000)
}
await bootstrap()
