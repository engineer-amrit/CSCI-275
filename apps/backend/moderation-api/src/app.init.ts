import { type INestApplication, VersioningType } from '@nestjs/common'
import { GlobalExceptionFilter } from './utils/exceptions/globalException.js'
import cookieParser from 'cookie-parser'

export const appInit = async (app: INestApplication) => {
  app.setGlobalPrefix('api')
  app.enableVersioning({
    type: VersioningType.URI,
  })
  app.use(cookieParser())
  app.useGlobalFilters(new GlobalExceptionFilter())
}
