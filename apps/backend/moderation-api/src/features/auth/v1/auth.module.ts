import { Global, Module } from '@nestjs/common'
import { AuthService } from './auth.service.js'
import { AuthController } from './auth.controller.js'
import { UserAuthGuard } from './user-auth.guard.js'
import { HttpService } from '@/infra/clients/index.js'
import { ConfigService } from '@/infra/config/index.js'

@Global()
@Module({
  controllers: [AuthController],
  providers: [ConfigService, HttpService, AuthService, UserAuthGuard],
  exports: [AuthService, UserAuthGuard, HttpService, ConfigService],
})
export class AuthModule {}
