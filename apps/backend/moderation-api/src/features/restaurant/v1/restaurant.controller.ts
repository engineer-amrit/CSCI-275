import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { controller, routes } from './restaurant.route.js'
import { RestaurantService } from './restaurant.service.js'
import { idParamSchema } from './schemas/restaurant.params.js'
import { ZodValidationPipe } from '@/utils/vailidation/zod-validation.pipe.js'
import { UserAuthGuard } from '@/features/auth/v1/user-auth.guard.js'
import type { DataVerificationStatus } from '@/types'

@Controller(controller)
@UseGuards(UserAuthGuard)
export class RestaurantController {
  constructor(
    @Inject(RestaurantService)
    private readonly restaurantService: RestaurantService,
  ) {}

  @Get()
  list() {
    return this.restaurantService.listRestaurants()
  }

  @Get(':id')
  getById(@Param(new ZodValidationPipe(idParamSchema)) params: { id: string }) {
    return this.restaurantService.getRestaurant(params.id)
  }

  @Get(':id/reviews')
  getReviews(
    @Param(new ZodValidationPipe(idParamSchema)) params: { id: string },
  ) {
    return this.restaurantService.getReviews(params.id)
  }

  @Get(':id/data-check')
  checkData(
    @Param(new ZodValidationPipe(idParamSchema)) params: { id: string },
  ) {
    return this.restaurantService.checkRestaurantData(params.id)
  }

  @Patch(':id/data-status')
  setDataStatus(
    @Param(new ZodValidationPipe(idParamSchema)) params: { id: string },
    @Body() body: { status?: DataVerificationStatus },
  ) {
    return this.restaurantService.setDataStatus(
      params.id,
      body.status ?? 'pending',
    )
  }

  @Patch(routes.verify.path)
  verify(@Param(new ZodValidationPipe(idParamSchema)) params: { id: string }) {
    return this.restaurantService.verify(params.id)
  }
}
