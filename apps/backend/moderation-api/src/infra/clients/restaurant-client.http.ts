import { Inject, Injectable } from '@nestjs/common'
import type { IRestaurantClient, Restaurant, Review } from '@/types'
import { HttpService } from './http.js'
import { ConfigService } from '../config/index.js'

type RawRestaurant = {
  id: string
  name: string
  cuisine: string
  description?: string | null
  street?: string | null
  city?: string | null
  zipcode?: string | null
  isClaimed?: boolean
  isVerified?: boolean
  createdAt?: string
  verifications?: { status: string }[]
}

type RawReview = {
  id: string
  restaurantId: string
  userId: string
  rating: number
  comment?: string | null
  content?: string | null
  createdAt?: string
}

const toRestaurant = (raw: RawRestaurant): Restaurant => ({
  id: raw.id,
  name: raw.name,
  cuisine: raw.cuisine ?? '',
  location: [raw.city, raw.zipcode].filter(Boolean).join(', ') || 'Unknown',
  description: raw.description ?? '',
  isVerified:
    raw.isVerified ??
    raw.verifications?.some((v) => v.status === 'VERIFIED') ??
    false,
  createdAt: new Date(raw.createdAt ?? Date.now()),
})

const toReview = (raw: RawReview): Review => ({
  id: raw.id,
  restaurantId: raw.restaurantId,
  userId: raw.userId,
  rating: raw.rating,
  isValid: true,
  content: raw.comment ?? raw.content ?? '',
  createdAt: new Date(raw.createdAt ?? Date.now()),
})

@Injectable()
export class RestaurantHttpClient implements IRestaurantClient {
  private readonly http: ReturnType<HttpService['client']>

  constructor(
    @Inject(HttpService) private readonly httpService: HttpService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    this.http = this.httpService.client(
      this.configService.RESTAURANT_SERVICE_URL,
    )
  }

  async getRestaurants(): Promise<Restaurant[]> {
    const data = await this.http.request<
      RawRestaurant[] | { restaurants: RawRestaurant[] }
    >('/api/restaurants')
    const list = Array.isArray(data) ? data : data.restaurants
    return (list ?? []).map(toRestaurant)
  }

  async getRestaurantById(id: string): Promise<Restaurant | null> {
    try {
      const raw = await this.http.request<RawRestaurant>(
        `/api/restaurants/${id}`,
      )
      return toRestaurant(raw)
    } catch (err) {
      if ((err as { status?: number }).status === 404) return null
      throw err
    }
  }

  async getReviewsByRestaurantId(restaurantId: string): Promise<Review[]> {
    const data = await this.http.request<
      RawReview[] | { reviews: RawReview[] }
    >(`/api/reviews?restaurantId=${encodeURIComponent(restaurantId)}`)
    const list = Array.isArray(data) ? data : data.reviews
    return (list ?? []).map(toReview)
  }

  async getReviews(): Promise<Review[]> {
    const data = await this.http.request<
      RawReview[] | { reviews: RawReview[] }
    >('/api/reviews')
    const list = Array.isArray(data) ? data : data.reviews
    return (list ?? []).map(toReview)
  }

  async updateVerificationStatus(
    id: string,
    isVerified: boolean,
  ): Promise<Restaurant> {
    await this.http.request(`/api/restaurants/${id}/verification`, {
      method: 'POST',
      body: {
        documentUrl: 'moderation-approval',
        status: isVerified ? 'VERIFIED' : 'PENDING',
      },
    })
    const restaurant = await this.getRestaurantById(id)
    if (!restaurant) throw new Error(`Restaurant '${id}' not found`)
    return restaurant
  }
}
