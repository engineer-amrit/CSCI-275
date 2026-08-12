import type { Request, Response, NextFunction } from 'express'

export type IController = {
  [key: string]: (req: Request, res: Response, next: NextFunction) => void
}

export interface Restaurant {
  id: string
  name: string
  cuisine: string
  location: string
  isVerified: boolean
  createdAt: Date
}

export interface Review {
  id: string
  restaurantId: string
  userId: string
  rating: number
  isValid: boolean
  createdAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'vendor' | 'moderator'
  createdAt: Date
}

export interface ModerationLog {
  id: string
  action: string
  targetType: string
  targetId: string
  notes: string
  moderatorId: string
  createdAt: Date
}

export interface VerificationResult {
  restaurantId: string
  isVerified: boolean
  totalReviews: number
  validReviews: number
  distinctUsers: number
  averageRating: number
  criteria: {
    minReviews: number
    minDistinctUsers: number
    minAverageRating: number
  }
}

export type DataVerificationStatus = 'verified' | 'flagged'

export interface DataCheckResult {
  restaurantId: string
  dataStatus: DataVerificationStatus
  flaggedWords: string[]
}

export interface IRestaurantClient {
  getRestaurantById(id: string): Promise<Restaurant | null>
  getReviewsByRestaurantId(restaurantId: string): Promise<Review[]>
  updateVerificationStatus(
    id: string,
    isVerified: boolean,
  ): Promise<Restaurant>
}

export interface IUserAuthClient {
  getUserById(id: string): Promise<User | null>
}
