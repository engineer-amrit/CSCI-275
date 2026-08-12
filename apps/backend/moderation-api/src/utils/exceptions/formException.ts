import { HttpException, HttpStatus } from '@nestjs/common'
import type { ErrorsDTO } from 'common'
export class FormException extends HttpException {
  constructor(err: ErrorsDTO[]) {
    super(
      {
        message: 'Form validation failed',
        errors: err,
      },
      HttpStatus.BAD_REQUEST,
    )
  }
}
