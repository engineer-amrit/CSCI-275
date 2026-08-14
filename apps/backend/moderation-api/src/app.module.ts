import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { loadConfig } from '@/infra/config/index.js'
import { RestaurantV1Module } from './features/restaurant/v1/restaurant.v1.module.js'
import { AuthModule } from './features/auth/v1/auth.module.js'
import { ReviewV1Module } from './features/review/v1/review.module.js'
import { MediaV1Module } from './features/media/v1/media.module.js'
import { HealthController } from './health.controller.js'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: loadConfig,
    }),
    AuthModule,
    RestaurantV1Module,
    ReviewV1Module,
    MediaV1Module,
  ],
  controllers: [HealthController],
})
export class AppModule {}
