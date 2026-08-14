import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common'
import type { Request } from 'express'
import { AuthService } from './auth.service.js'
import { extractToken, type AuthenticatedRequest } from './user-auth.guard.js'

const loginSchema = (body: unknown): { email: string; password: string } => {
  const { email, password } = (body ?? {}) as {
    email?: string
    password?: string
  }
  if (!email || !password)
    throw new UnauthorizedException('email and password are required')
  return { email, password }
}

@Controller('v1/auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: unknown) {
    const { email, password } = loginSchema(body)
    return this.authService.login(email, password)
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request) {
    const token = extractToken(req)
    if (token) await this.authService.logout(token)
    return { ok: true }
  }

  @Get('me')
  async me(@Req() req: AuthenticatedRequest) {
    const token = extractToken(req)
    const user = await this.authService.requireModerator(token ?? '')
    return { user }
  }
}
