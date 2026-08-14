import { Inject, Injectable } from '@nestjs/common'
import type { IUserAuthClient, User } from '@/types'
import { HttpService } from './http.js'
import { ConfigService } from '../config/index.js'

type RawUser = {
  id: string
  email: string
  name: string
  role: string
  isRoot?: boolean
  banned?: boolean
}

@Injectable()
export class UserAuthHttpClient implements IUserAuthClient {
  private readonly http: ReturnType<HttpService['client']>

  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    this.http = this.httpService.client(
      this.configService.USER_AUTH_SERVICE_URL,
    )
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const { user } = await this.http.request<{ user: RawUser }>(
        `/json/users/${id}`,
      )
      if (!user) return null
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as User['role'],
        createdAt: new Date(),
      }
    } catch (err) {
      if ((err as { status?: number }).status === 404) return null
      throw err
    }
  }
}
