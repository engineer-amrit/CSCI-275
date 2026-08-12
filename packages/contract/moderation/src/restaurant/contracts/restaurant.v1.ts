import { validContract } from '@utils/shared'
import { restaurantSchemas } from '../restaurant.schema.js'
import { RestaurantResDTos } from '../restaurant.dto.js'

export const restaurantV1 = validContract({
  prefix: '/restaurant',
  version: '1',
  routes: {
    verify: {
      method: 'PATCH',
      path: '/verify/:id',
      contentType: 'application/json',
      request: restaurantSchemas.verify,
      response: RestaurantResDTos.verify,
    },
  },
})
