import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'
import type {
  IRestaurantClient,
  IUserAuthClient,
  VerificationResult,
  DataCheckResult,
  DataVerificationStatus,
  Restaurant,
  Review,
} from '@/types'

const MIN_REVIEWS = 5
const MIN_DISTINCT_USERS = 5
const MIN_AVERAGE_RATING = 2.5

const OFFENSIVE_WORDS = ['trash', 'stupid', 'disgusting', 'awful', 'horrible']

@Injectable()
export class RestaurantService {
  private readonly logger = new Logger(RestaurantService.name)
  private readonly dataStatusOverrides = new Map<
    string,
    DataVerificationStatus
  >()

  constructor(
    @Inject('IRestaurantClient')
    private readonly restaurantClient: IRestaurantClient,
    @Inject('IUserAuthClient')
    private readonly userAuthClient: IUserAuthClient,
  ) {
    void this.userAuthClient
  }

  async verify(restaurantId: string): Promise<VerificationResult> {
    const restaurant =
      await this.restaurantClient.getRestaurantById(restaurantId)

    if (!restaurant) {
      throw new NotFoundException(`Restaurant '${restaurantId}' not found`)
    }

    if (restaurant.isVerified) {
      this.logger.log(`Restaurant '${restaurantId}' is already verified`)
      return {
        restaurantId,
        isVerified: true,
        totalReviews: 0,
        validReviews: 0,
        distinctUsers: 0,
        averageRating: 0,
        criteria: {
          minReviews: MIN_REVIEWS,
          minDistinctUsers: MIN_DISTINCT_USERS,
          minAverageRating: MIN_AVERAGE_RATING,
        },
      }
    }

    const reviews =
      await this.restaurantClient.getReviewsByRestaurantId(restaurantId)

    const validReviews = reviews.filter((r) => r.isValid)

    const totalReviews = validReviews.length
    const distinctUsers = new Set(validReviews.map((r) => r.userId)).size
    const averageRating =
      totalReviews > 0
        ? validReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0

    const meetsReviewCount = totalReviews >= MIN_REVIEWS
    const meetsDistinctUsers = distinctUsers >= MIN_DISTINCT_USERS
    const meetsAverageRating = averageRating >= MIN_AVERAGE_RATING

    const isVerified =
      meetsReviewCount && meetsDistinctUsers && meetsAverageRating

    if (isVerified) {
      await this.restaurantClient.updateVerificationStatus(restaurantId, true)
      this.logger.log(
        `Restaurant '${restaurantId}' verified: ${totalReviews} reviews, ${distinctUsers} users, avg ${averageRating.toFixed(2)}`,
      )
    }

    return {
      restaurantId,
      isVerified,
      totalReviews,
      validReviews: totalReviews,
      distinctUsers,
      averageRating: Math.round(averageRating * 100) / 100,
      criteria: {
        minReviews: MIN_REVIEWS,
        minDistinctUsers: MIN_DISTINCT_USERS,
        minAverageRating: MIN_AVERAGE_RATING,
      },
    }
  }

  async checkData(restaurantId: string): Promise<DataCheckResult> {
    const restaurant =
      await this.restaurantClient.getRestaurantById(restaurantId)

    if (!restaurant) {
      throw new NotFoundException(`Restaurant '${restaurantId}' not found`)
    }

    const fields = [
      restaurant.name,
      restaurant.cuisine,
      restaurant.location,
      restaurant.description ?? '',
    ].map((field) => field.toLowerCase())
    const flaggedWords = OFFENSIVE_WORDS.filter((word) =>
      fields.some((field) => field.includes(word)),
    )

    return {
      restaurantId,
      dataStatus: flaggedWords.length > 0 ? 'flagged' : 'verified',
      flaggedWords,
    }
  }

  async listRestaurants(): Promise<Restaurant[]> {
    const restaurants = await this.restaurantClient.getRestaurants()
    return restaurants.map((r) => ({
      ...r,
      dataStatus:
        this.dataStatusOverrides.get(r.id) ?? r.dataStatus ?? 'pending',
      flaggedWords: r.flaggedWords ?? [],
    }))
  }

  async getRestaurant(restaurantId: string): Promise<Restaurant> {
    const restaurant =
      await this.restaurantClient.getRestaurantById(restaurantId)
    if (!restaurant) {
      throw new NotFoundException(`Restaurant '${restaurantId}' not found`)
    }
    return {
      ...restaurant,
      dataStatus:
        this.dataStatusOverrides.get(restaurantId) ??
        restaurant.dataStatus ??
        'pending',
      flaggedWords: restaurant.flaggedWords ?? [],
    }
  }

  async getReviews(restaurantId: string): Promise<Review[]> {
    return this.restaurantClient.getReviewsByRestaurantId(restaurantId)
  }

  async checkRestaurantData(
    restaurantId: string,
  ): Promise<
    Restaurant & { dataStatus: DataVerificationStatus; flaggedWords: string[] }
  > {
    const restaurant = await this.getRestaurant(restaurantId)
    const result = await this.checkData(restaurantId)
    return {
      ...restaurant,
      dataStatus: result.dataStatus,
      flaggedWords: result.flaggedWords,
    }
  }

  async setDataStatus(
    restaurantId: string,
    status: DataVerificationStatus,
  ): Promise<
    Restaurant & { dataStatus: DataVerificationStatus; flaggedWords: string[] }
  > {
    const restaurant = await this.getRestaurant(restaurantId)
    this.dataStatusOverrides.set(restaurantId, status)
    return {
      ...restaurant,
      dataStatus: status,
      flaggedWords:
        status === 'verified' ? [] : (restaurant.flaggedWords ?? []),
    }
  }
}
