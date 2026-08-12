import { z } from 'zod'

const idSchema = z.object(
  {
    id: z.string('id is required').min(1),
  },
  'id is required',
)

export { idSchema }
