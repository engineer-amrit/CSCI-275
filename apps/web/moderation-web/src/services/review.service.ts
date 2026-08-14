import type { Review } from "@/types";
import { request } from "./http.js";

function toReview(r: {
  id: string;
  restaurantId: string;
  userId: string;
  rating: number;
  content?: string | null;
  language?: string;
  isLanguageVerified?: boolean;
  createdAt: string | Date;
}): Review {
  return {
    id: r.id,
    restaurantId: r.restaurantId,
    restaurantName: "",
    userId: r.userId,
    rating: r.rating,
    content: r.content ?? "",
    language: r.language ?? "",
    isLanguageVerified: r.isLanguageVerified ?? false,
    isValid: true,
    createdAt: new Date(r.createdAt),
  };
}

export const reviewService = {
  async getAll(): Promise<Review[]> {
    const reviews = await request<Record<string, unknown>[]>("/v1/review");
    return reviews.map((r) => toReview(r as Parameters<typeof toReview>[0]));
  },

  async setLanguageVerified(id: string, verified: boolean): Promise<Review> {
    const r = await request<Record<string, unknown>>(
      `/v1/review/${id}/language`,
      {
        method: "PATCH",
        body: { verified },
      },
    );
    return toReview(r as Parameters<typeof toReview>[0]);
  },

  async undo(id: string): Promise<Review> {
    const r = await request<Record<string, unknown>>(`/v1/review/${id}/undo`, {
      method: "POST",
    });
    return toReview(r as Parameters<typeof toReview>[0]);
  },
};
