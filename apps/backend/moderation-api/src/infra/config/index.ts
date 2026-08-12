import { Injectable, Logger } from '@nestjs/common'
import { configSchema } from '@/schema/config.schema.js'
import { z } from 'zod'

@Injectable()
export class ConfigService {
  private readonly logger = new Logger(ConfigService.name)
  private readonly config: z.infer<typeof configSchema>

  constructor() {
    const parsed = configSchema.safeParse(process.env)

    if (!parsed.success) {
      this.logger.error('Invalid environment variables:')
      this.logger.error(z.prettifyError(parsed.error))
      process.exit(1)
    }

    this.config = parsed.data
  }

  get NODE_ENV(): string {
    return this.config.NODE_ENV
  }

  get HOST(): string {
    return this.config.HOST
  }

  get DB_HOST(): string {
    return this.config.DB_HOST
  }

  get isProduction(): boolean {
    return this.config.NODE_ENV === 'production'
  }

  get isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development'
  }

  get isTest(): boolean {
    return this.config.NODE_ENV === 'test'
  }

  get isStaging(): boolean {
    return this.config.NODE_ENV === 'staging'
  }

  get RESTAURANT_SERVICE_URL(): string {
    return this.config.RESTAURANT_SERVICE_URL
  }

  get USER_AUTH_SERVICE_URL(): string {
    return this.config.USER_AUTH_SERVICE_URL
  }

  get SEARCH_SERVICE_URL(): string {
    return this.config.SEARCH_SERVICE_URL
  }
}

export const loadConfig = (env: Record<string, unknown>) => {
  const parsed = configSchema.safeParse(env)

  if (!parsed.success) {
    const logger = new Logger('Config')
    logger.error('Invalid environment variables:')
    logger.error(z.prettifyError(parsed.error))
    process.exit(1)
  }

  return parsed.data
}
