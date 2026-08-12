import { Controller, Param, Patch } from '@nestjs/common'
import { controller, routes } from './restaurant.route.js'
import { RestaurantService } from './restaurant.service.js'
import { idParamSchema } from './schemas/restaurant.params.js'
import { ZodValidationPipe } from '@/utils/vailidation/zod-validation.pipe.js'

@Controller(controller)
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Patch(routes.verify.path)
  verify(@Param(new ZodValidationPipe(idParamSchema)) params: { id: string }) {
    return this.restaurantService.verify(params.id)
  }
}
