import type { Request, Response, NextFunction } from 'express'

export type IController = {
  [key: string]: (req: Request, res: Response, next: NextFunction) => void
}

export type DataVerificationStatus = 'pending' | 'verified' | 'flagged'

export interface Restaurant {
  id: string
  name: string
  cuisine: string
  location: string
  description?: string
  isVerified: boolean
  dataStatus?: DataVerificationStatus
  flaggedWords?: string[]
  createdAt: Date
}

export interface Review {
  id: string
  restaurantId: string
  userId: string
  rating: number
  isValid: boolean
  content?: string
  createdAt: Date
}

export type LanguageVerificationStatus = 'pending' | 'verified' | 'flagged'

export interface ModeratedReview extends Review {
  content: string
  language: string
  isLanguageVerified: boolean
}

export interface MediaItem {
  id: string
  restaurantId: string
  restaurantName: string
  url: string
  type: 'image' | 'video'
  title: string
  isVerified: boolean
  createdAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'vendor' | 'moderator' | 'admin'
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

export interface DataCheckResult {
  restaurantId: string
  dataStatus: DataVerificationStatus
  flaggedWords: string[]
}

export interface IRestaurantClient {
  getRestaurantById(id: string): Promise<Restaurant | null>
  getReviewsByRestaurantId(restaurantId: string): Promise<Review[]>
  getRestaurants(): Promise<Restaurant[]>
  updateVerificationStatus(id: string, isVerified: boolean): Promise<Restaurant>
}

export interface IUserAuthClient {
  getUserById(id: string): Promise<User | null>
}
