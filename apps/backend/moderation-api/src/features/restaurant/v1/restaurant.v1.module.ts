import { Module } from '@nestjs/common'
import { RestaurantController } from './restaurant.controller.js'
import { RestaurantService } from './restaurant.service.js'
import {
  MockRestaurantClient,
  MockUserAuthClient,
} from '@/infra/clients/index.js'

@Module({
  controllers: [RestaurantController],
  providers: [
    RestaurantService,
    { provide: 'IRestaurantClient', useClass: MockRestaurantClient },
    { provide: 'IUserAuthClient', useClass: MockUserAuthClient },
  ],
})
export class RestaurantV1Module {}
