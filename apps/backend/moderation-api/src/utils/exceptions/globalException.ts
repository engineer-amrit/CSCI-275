import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'

import type { Response } from 'express'
import { ZodError } from 'zod'
import { MulterError } from 'multer'

import type { ErrorDTO, ErrorsDTO } from 'common'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()

    const response = ctx.getResponse<Response>()
    const { statusCode, payload } = this.normalizeException(exception)
    response.status(statusCode).json(payload)
  }

  private normalizeException(exception: unknown): {
    statusCode: number
    payload: ErrorDTO
  } {
    /**
     * Zod validation errors
     */
    if (exception instanceof ZodError) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        payload: {
          message: 'Validation failed',
          errors: this.mapZodErrors(exception),
        },
      }
    }

    /**
     * Multer/file upload errors
     */
    if (exception instanceof MulterError) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        payload: {
          message: 'File upload failed',
          errors: this.mapMulterError(exception),
        },
      }
    }

    /**
     * Nest HTTP exceptions
     */
    if (exception instanceof HttpException) {
      return this.mapHttpException(exception)
    }

    /**
     * Unknown/internal errors
     */
    this.logUnknownError(exception)

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,

      payload: {
        message: 'Internal server error',
      },
    }
  }

  private mapZodErrors(error: ZodError): ErrorsDTO[] {
    return error.issues.flatMap((issue) => {
      if (issue.code === 'invalid_union') {
        return this.handleUnionIssue(issue)
      }

      return [
        {
          path: issue.path,
          message: issue.message,
        },
      ]
    })
  }

  private handleUnionIssue(
    issue: Extract<ZodError['issues'][number], { code: 'invalid_union' }>,
  ): ErrorsDTO[] {
    const errors: ErrorsDTO[] = []

    errors.push({
      path: issue.path,
      message: issue.message,
    })

    issue.errors.forEach((err1) => {
      err1.forEach((err2) => {
        const internalError: ErrorsDTO[] = []
        if (err2.code === 'invalid_union')
          internalError.push(...this.handleUnionIssue(err2))
        errors.push({
          path: err2.path,
          message: err2.message,
        })
        errors.push(...internalError)
      })
    })

    return errors
  }

  private mapMulterError(error: MulterError): ErrorsDTO[] {
    const field = error.field ?? 'file'

    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return [
          {
            path: [field],
            message: 'File too large',
          },
        ]

      case 'LIMIT_FILE_COUNT':
        return [
          {
            path: [field],
            message: 'Too many files uploaded',
          },
        ]

      case 'LIMIT_UNEXPECTED_FILE':
        return [
          {
            path: [field],
            message: 'Unexpected file uploaded',
          },
        ]

      case 'LIMIT_PART_COUNT':
        return [
          {
            path: [field],
            message: 'Too many multipart parts',
          },
        ]

      case 'LIMIT_FIELD_COUNT':
        return [
          {
            path: [field],
            message: 'Too many form fields',
          },
        ]

      case 'LIMIT_FIELD_KEY':
        return [
          {
            path: [field],
            message: 'Field name too long',
          },
        ]

      case 'LIMIT_FIELD_VALUE':
        return [
          {
            path: [field],
            message: 'Field value too large',
          },
        ]

      default:
        return [
          {
            path: [field],
            message: error.message,
          },
        ]
    }
  }

  private mapHttpException(error: HttpException): {
    statusCode: number
    payload: ErrorDTO
  } {
    const statusCode = error.getStatus()

    const response = error.getResponse()

    /**
     * String exception
     */
    if (typeof response === 'string') {
      return {
        statusCode,
        payload: {
          message: response,
        },
      }
    }

    /**
     * Already normalized payload
     */
    if (typeof response === 'object' && response !== null) {
      const normalized = response as Partial<ErrorDTO>

      return {
        statusCode,
        payload: {
          message: normalized.message ?? 'Request failed',

          errors: normalized.errors,
        },
      }
    }
    return {
      statusCode,
      payload: {
        message: 'Request failed',
      },
    }
  }

  private logUnknownError(exception: unknown) {
    if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack)

      return
    }

    this.logger.error(String(exception))
  }
}
