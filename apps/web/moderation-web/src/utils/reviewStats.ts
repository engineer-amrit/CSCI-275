import type { Review } from "@/types";

export type ReviewFilter = "all" | "verified" | "unverified";

export interface ReviewStats {
  total: number;
  verified: number;
  pending: number;
}

export function computeReviewStats(reviews: Review[]): ReviewStats {
  const verified = reviews.filter((r) => r.isLanguageVerified).length;
  return {
    total: reviews.length,
    verified,
    pending: reviews.length - verified,
  };
}

export function filterReviews(
  reviews: Review[],
  filter: ReviewFilter,
): Review[] {
  if (filter === "verified") {
    return reviews.filter((r) => r.isLanguageVerified);
  }
  if (filter === "unverified") {
    return reviews.filter((r) => !r.isLanguageVerified);
  }
  return reviews;
}
