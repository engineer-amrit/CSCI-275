import type { ContractReqSchemaDef } from 'common'
import { idSchema } from '../schema/index.js'

export const restaurantSchemas = {
  verify: {
    params: idSchema,
  },
} satisfies ContractReqSchemaDef
