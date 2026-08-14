import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { HttpError, HttpService } from '@/infra/clients/index.js'
import { ConfigService } from '@/infra/config/index.js'

export interface SessionUser {
  id: string
  name: string
  email: string
  role: string
  isRoot: boolean
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  private get http() {
    return this.httpService.client(this.configService.USER_AUTH_SERVICE_URL)
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ sessionToken: string; user: SessionUser }> {
    try {
      const result = await this.http.request<{
        sessionToken: string
        user: SessionUser
      }>('/json/login', { method: 'POST', body: { email, password } })
      return result
    } catch (err) {
      if (err instanceof HttpError) {
        throw new UnauthorizedException(
          err.message || 'Invalid email or password',
        )
      }
      this.logger.error(`user-auth login failed: ${(err as Error).message}`)
      throw new UnauthorizedException('Unable to log in')
    }
  }

  async logout(token: string): Promise<void> {
    await this.http.request('/json/logout', {
      method: 'POST',
      headers: { 'x-session-token': token },
      body: {},
    })
  }

  async verify(token: string): Promise<SessionUser | null> {
    if (!token) return null
    try {
      const result = await this.http.request<{
        valid: boolean
        user?: SessionUser
      }>('/json/verify', { method: 'POST', body: { token } })
      if (!result.valid || !result.user) return null
      return result.user
    } catch (err) {
      if ((err as { status?: number }).status === 401) return null
      this.logger.error(`user-auth verify failed: ${(err as Error).message}`)
      throw new UnauthorizedException('Unable to verify session token')
    }
  }

  async requireModerator(token: string): Promise<SessionUser> {
    const user = await this.verify(token)
    if (!user) {
      throw new UnauthorizedException('Invalid or expired session token')
    }
    if (user.role !== 'moderator' && user.role !== 'admin') {
      throw new UnauthorizedException('Moderator role required')
    }
    return user
  }
}
