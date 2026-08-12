import { restaurantV1 } from '@contract/moderation'

export const controller = {
  path: restaurantV1.prefix,
  version: restaurantV1.version,
} as const

export const routes = restaurantV1.routes
