import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ReviewService } from './review.service.js'
import { UserAuthGuard } from '@/features/auth/v1/user-auth.guard.js'

@Controller('v1/review')
@UseGuards(UserAuthGuard)
export class ReviewController {
  constructor(
    @Inject(ReviewService) private readonly reviewService: ReviewService,
  ) {}

  @Get()
  list() {
    return this.reviewService.listReviews()
  }

  @Patch(':id/language')
  setLanguage(@Param('id') id: string, @Body() body: { verified?: boolean }) {
    return this.reviewService.setLanguageVerified(id, body.verified === true)
  }

  @Post(':id/undo')
  @HttpCode(200)
  undo(@Param('id') id: string) {
    return this.reviewService.undo(id)
  }
}
