import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/schema/config.schema.js', () => ({
  configSchema: {
    safeParse: vi.fn().mockReturnValue({
      success: true,
      data: {
        NODE_ENV: 'test',
        HOST: 'localhost',
        DB_HOST: 'localhost',
      },
    }),
  },
}))

describe('ConfigService', () => {
  let configService: InstanceType<typeof import('../index.js').ConfigService>

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules()
    const module = await import('../index.js')
    configService = new module.ConfigService()
  })

  it('should return NODE_ENV', () => {
    expect(configService.NODE_ENV).toBe('test')
  })

  it('should return HOST', () => {
    expect(configService.HOST).toBe('localhost')
  })

  it('should return DB_HOST', () => {
    expect(configService.DB_HOST).toBe('localhost')
  })

  it('should return isProduction as false for test environment', () => {
    expect(configService.isProduction).toBe(false)
  })

  it('should return isDevelopment as false for test environment', () => {
    expect(configService.isDevelopment).toBe(false)
  })

  it('should return isTest as true for test environment', () => {
    expect(configService.isTest).toBe(true)
  })

  it('should return isStaging as false for test environment', () => {
    expect(configService.isStaging).toBe(false)
  })
})
