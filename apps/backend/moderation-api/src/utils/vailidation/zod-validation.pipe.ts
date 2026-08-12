import { type PipeTransform, type ArgumentMetadata } from '@nestjs/common'
import { type ZodType } from 'zod'
import { queryToObj } from '@utils/shared'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const localValue = value ?? {}
    if (metadata.type === 'query') {
      const obj = queryToObj(localValue as Record<string, string>)
      return this.schema.parse(obj)
    }
    return this.schema.parse(localValue)
  }
}
