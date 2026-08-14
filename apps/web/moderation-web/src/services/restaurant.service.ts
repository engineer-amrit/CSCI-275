import type {
  Restaurant,
  Review,
  VerificationResult,
  DataVerificationStatus,
} from "@/types";
import { request } from "./http.js";

function toRestaurant(r: {
  id: string;
  name: string;
  cuisine: string;
  location: string;
  description?: string | null;
  isVerified: boolean;
  dataStatus?: DataVerificationStatus;
  flaggedWords?: string[];
  createdAt: string | Date;
}): Restaurant {
  return {
    id: r.id,
    name: r.name,
    cuisine: r.cuisine,
    location: r.location,
    description: r.description ?? "",
    isVerified: r.isVerified,
    dataStatus: r.dataStatus ?? "pending",
    flaggedWords: r.flaggedWords ?? [],
    createdAt: new Date(r.createdAt),
  };
}

function toReview(r: {
  id: string;
  restaurantId: string;
  userId: string;
  rating: number;
  content?: string | null;
  createdAt: string | Date;
}): Review {
  return {
    id: r.id,
    restaurantId: r.restaurantId,
    restaurantName: "",
    userId: r.userId,
    rating: r.rating,
    content: r.content ?? "",
    language: "",
    isLanguageVerified: false,
    isValid: true,
    createdAt: new Date(r.createdAt),
  };
}

export const restaurantService = {
  async getAll(): Promise<Restaurant[]> {
    const restaurants =
      await request<Record<string, unknown>[]>("/v1/restaurant");
    return restaurants.map((r) =>
      toRestaurant(r as Parameters<typeof toRestaurant>[0]),
    );
  },

  async getById(id: string): Promise<Restaurant | undefined> {
    try {
      const r = await request<Record<string, unknown>>(`/v1/restaurant/${id}`);
      return toRestaurant(r as Parameters<typeof toRestaurant>[0]);
    } catch (err) {
      if ((err as Error).message.includes("not found")) return undefined;
      throw err;
    }
  },

  async getReviews(restaurantId: string): Promise<Review[]> {
    const reviews = await request<Record<string, unknown>[]>(
      `/v1/restaurant/${restaurantId}/reviews`,
    );
    return reviews.map((r) => toReview(r as Parameters<typeof toReview>[0]));
  },

  async verify(restaurantId: string): Promise<VerificationResult> {
    return request<VerificationResult>(
      `/v1/restaurant/verify/${restaurantId}`,
      {
        method: "PATCH",
      },
    );
  },

  async checkData(restaurantId: string): Promise<Restaurant> {
    const r = await request<Record<string, unknown>>(
      `/v1/restaurant/${restaurantId}/data-check`,
    );
    return toRestaurant(r as Parameters<typeof toRestaurant>[0]);
  },

  async setDataStatus(
    restaurantId: string,
    status: Restaurant["dataStatus"],
  ): Promise<Restaurant> {
    const r = await request<Record<string, unknown>>(
      `/v1/restaurant/${restaurantId}/data-status`,
      { method: "PATCH", body: { status } },
    );
    return toRestaurant(r as Parameters<typeof toRestaurant>[0]);
  },
};
