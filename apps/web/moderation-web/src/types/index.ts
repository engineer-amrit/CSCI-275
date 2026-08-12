export interface User {
  id: string;
  name: string;
  email: string;
  role: "moderator" | "admin";
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface Report {
  id: string;
  targetType: "restaurant" | "review" | "media";
  targetId: string;
  reason: string;
  status: "pending" | "under_review" | "resolved" | "rejected";
  reporterId: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: "pending" | "in_progress" | "resolved" | "closed";
  userId: string;
  assignedTo?: string;
  createdAt: string;
}

export type DataVerificationStatus = "pending" | "verified" | "flagged";

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  location: string;
  isVerified: boolean;
  dataStatus: DataVerificationStatus;
  flaggedWords: string[];
  createdAt: Date;
}

export interface Review {
  id: string;
  restaurantId: string;
  restaurantName: string;
  userId: string;
  rating: number;
  content: string;
  language: string;
  isLanguageVerified: boolean;
  isValid: boolean;
  createdAt: Date;
}

export interface Media {
  id: string;
  restaurantId: string;
  restaurantName: string;
  url: string;
  type: "image" | "video";
  title: string;
  isVerified: boolean;
  createdAt: Date;
}

export interface VerificationCriteria {
  minReviews: number;
  minDistinctUsers: number;
  minAverageRating: number;
}

export interface VerificationResult {
  restaurantId: string;
  isVerified: boolean;
  totalReviews: number;
  validReviews: number;
  distinctUsers: number;
  averageRating: number;
  criteria: VerificationCriteria;
}
