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
import { MediaService } from './media.service.js'
import { UserAuthGuard } from '@/features/auth/v1/user-auth.guard.js'

@Controller('v1/media')
@UseGuards(UserAuthGuard)
export class MediaController {
  constructor(
    @Inject(MediaService) private readonly mediaService: MediaService,
  ) {}

  @Get()
  list() {
    return this.mediaService.list()
  }

  @Patch(':id/verified')
  setVerified(@Param('id') id: string, @Body() body: { isVerified?: boolean }) {
    return this.mediaService.setVerified(id, body.isVerified === true)
  }

  @Post(':id/undo')
  @HttpCode(200)
  undo(@Param('id') id: string) {
    return this.mediaService.undo(id)
  }
}
