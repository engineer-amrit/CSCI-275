import { z } from 'zod'

export const configSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production', 'staging'])
    .default('development'),
  HOST: z.string().default('localhost'),
  DB_HOST: z.string().default('localhost'),

  RESTAURANT_SERVICE_URL: z.string().url().default('http://localhost:3002'),
  USER_AUTH_SERVICE_URL: z.string().url().default('http://localhost:3001'),
  SEARCH_SERVICE_URL: z.string().url().default('http://localhost:3003'),
})
