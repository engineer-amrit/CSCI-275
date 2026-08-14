import { Module } from '@nestjs/common'
import { ReviewController } from './review.controller.js'
import { ReviewService } from './review.service.js'
import { RestaurantHttpClient, HttpService } from '@/infra/clients/index.js'
import { ConfigService } from '@/infra/config/index.js'

@Module({
  controllers: [ReviewController],
  providers: [
    ConfigService,
    HttpService,
    ReviewService,
    { provide: 'IRestaurantClient', useClass: RestaurantHttpClient },
  ],
})
export class ReviewV1Module {}
