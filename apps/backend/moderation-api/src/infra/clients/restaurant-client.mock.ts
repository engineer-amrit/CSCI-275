import { Injectable, Logger } from '@nestjs/common'
import type { IRestaurantClient, Restaurant, Review } from '@/types'

const mockRestaurants: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Sushi Heaven',
    cuisine: 'Japanese',
    location: 'Vancouver, BC',
    isVerified: false,
    createdAt: new Date('2026-07-01'),
  },
  {
    id: 'rest-2',
    name: 'Pasta Palace',
    cuisine: 'Italian',
    location: 'Burnaby, BC',
    isVerified: true,
    createdAt: new Date('2026-06-15'),
  },
  {
    id: 'rest-3',
    name: 'Curry House',
    cuisine: 'Indian',
    location: 'Surrey, BC',
    isVerified: false,
    createdAt: new Date('2026-07-10'),
  },
  {
    id: 'rest-4',
    name: 'Burger Barn',
    cuisine: 'American',
    location: 'Richmond, BC',
    isVerified: false,
    createdAt: new Date('2026-07-20'),
  },
  {
    id: 'rest-5',
    name: 'Le Petit Bistro',
    cuisine: 'French',
    location: 'Vancouver, BC',
    isVerified: true,
    createdAt: new Date('2026-05-20'),
  },
]

const mockReviews: Review[] = [
  {
    id: 'rev-1',
    restaurantId: 'rest-1',
    userId: 'user-1',
    rating: 3.0,
    isValid: true,
    createdAt: new Date('2026-07-05'),
  },
  {
    id: 'rev-2',
    restaurantId: 'rest-1',
    userId: 'user-2',
    rating: 3.5,
    isValid: true,
    createdAt: new Date('2026-07-06'),
  },
  {
    id: 'rev-3',
    restaurantId: 'rest-1',
    userId: 'user-3',
    rating: 2.5,
    isValid: true,
    createdAt: new Date('2026-07-07'),
  },
  {
    id: 'rev-4',
    restaurantId: 'rest-1',
    userId: 'user-4',
    rating: 4.0,
    isValid: true,
    createdAt: new Date('2026-07-08'),
  },
  {
    id: 'rev-5',
    restaurantId: 'rest-3',
    userId: 'user-1',
    rating: 3.5,
    isValid: true,
    createdAt: new Date('2026-07-12'),
  },
  {
    id: 'rev-6',
    restaurantId: 'rest-3',
    userId: 'user-2',
    rating: 2.0,
    isValid: true,
    createdAt: new Date('2026-07-13'),
  },
  {
    id: 'rev-7',
    restaurantId: 'rest-3',
    userId: 'user-3',
    rating: 4.0,
    isValid: true,
    createdAt: new Date('2026-07-14'),
  },
  {
    id: 'rev-8',
    restaurantId: 'rest-4',
    userId: 'user-1',
    rating: 4.5,
    isValid: true,
    createdAt: new Date('2026-07-21'),
  },
  {
    id: 'rev-9',
    restaurantId: 'rest-4',
    userId: 'user-2',
    rating: 4.0,
    isValid: true,
    createdAt: new Date('2026-07-22'),
  },
  {
    id: 'rev-10',
    restaurantId: 'rest-4',
    userId: 'user-3',
    rating: 3.5,
    isValid: true,
    createdAt: new Date('2026-07-23'),
  },
  {
    id: 'rev-11',
    restaurantId: 'rest-4',
    userId: 'user-4',
    rating: 5.0,
    isValid: true,
    createdAt: new Date('2026-07-24'),
  },
  {
    id: 'rev-12',
    restaurantId: 'rest-4',
    userId: 'user-5',
    rating: 4.0,
    isValid: true,
    createdAt: new Date('2026-07-25'),
  },
]

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

@Injectable()
export class MockRestaurantClient implements IRestaurantClient {
  private readonly logger = new Logger(MockRestaurantClient.name)

  async getRestaurantById(id: string): Promise<Restaurant | null> {
    this.logger.warn(`[MOCK] GET restaurant/${id}`)
    await delay(100)
    return mockRestaurants.find((r) => r.id === id) ?? null
  }

  async getReviewsByRestaurantId(restaurantId: string): Promise<Review[]> {
    this.logger.warn(`[MOCK] GET restaurant/${restaurantId}/reviews`)
    await delay(100)
    return mockReviews.filter((r) => r.restaurantId === restaurantId)
  }

  async updateVerificationStatus(
    id: string,
    isVerified: boolean,
  ): Promise<Restaurant> {
    this.logger.warn(
      `[MOCK] PATCH restaurant/${id}/verify → ${isVerified}`,
    )
    await delay(100)
    const restaurant = mockRestaurants.find((r) => r.id === id)
    if (!restaurant) throw new Error(`Restaurant '${id}' not found`)
    restaurant.isVerified = isVerified
    return restaurant
  }
}
