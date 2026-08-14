import { Module } from '@nestjs/common'
import { RestaurantController } from './restaurant.controller.js'
import { RestaurantService } from './restaurant.service.js'
import {
  RestaurantHttpClient,
  UserAuthHttpClient,
  HttpService,
} from '@/infra/clients/index.js'
import { ConfigService } from '@/infra/config/index.js'

@Module({
  controllers: [RestaurantController],
  providers: [
    ConfigService,
    HttpService,
    RestaurantService,
    { provide: 'IRestaurantClient', useClass: RestaurantHttpClient },
    { provide: 'IUserAuthClient', useClass: UserAuthHttpClient },
  ],
})
export class RestaurantV1Module {}
