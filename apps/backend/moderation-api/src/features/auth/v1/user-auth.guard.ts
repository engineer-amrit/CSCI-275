import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common'
import type { Request } from 'express'
import { AuthService, type SessionUser } from './auth.service.js'

export interface AuthenticatedRequest extends Request {
  user?: SessionUser
}

export function extractToken(req: Request): string | null {
  const header = req.headers['x-session-token']
  if (header) return Array.isArray(header) ? (header[0] ?? null) : header
  const auth = req.headers.authorization ?? ''
  if (auth.startsWith('Bearer ')) return auth.slice(7)
  return null
}

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    const token = extractToken(request)
    const user = await this.authService.requireModerator(token ?? '')
    request.user = user
    return true
  }
}
