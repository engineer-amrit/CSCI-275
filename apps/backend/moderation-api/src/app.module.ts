import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { loadConfig } from '@/infra/config/index.js'
import { RestaurantV1Module } from './features/restaurant/v1/restaurant.v1.module.js'
import { HealthController } from './health.controller.js'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: loadConfig,
    }),
    RestaurantV1Module,
  ],
  controllers: [HealthController],
})
export class AppModule {}
