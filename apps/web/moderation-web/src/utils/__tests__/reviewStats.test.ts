import { describe, it, expect } from "vitest";
import type { Review } from "@/types";
import {
  computeReviewStats,
  filterReviews,
  type ReviewFilter,
} from "@/utils/reviewStats";

function review(
  id: string,
  isLanguageVerified: boolean,
  overrides: Partial<Review> = {},
): Review {
  return {
    id,
    restaurantId: "rest-1",
    restaurantName: "Sushi Heaven",
    userId: "user-1",
    rating: 4.0,
    content: "A review",
    language: "English",
    isLanguageVerified,
    isValid: true,
    createdAt: new Date("2026-07-05"),
    ...overrides,
  };
}

const sampleReviews: Review[] = [
  review("rev-1", true),
  review("rev-2", false),
  review("rev-3", true),
  review("rev-4", false),
  review("rev-5", false),
];

describe("computeReviewStats", () => {
  it("returns zeroed stats for an empty list", () => {
    expect(computeReviewStats([])).toEqual({
      total: 0,
      verified: 0,
      pending: 0,
    });
  });

  it("counts total, verified and pending reviews", () => {
    expect(computeReviewStats(sampleReviews)).toEqual({
      total: 5,
      verified: 2,
      pending: 3,
    });
  });

  it("keeps verified and pending consistent with total", () => {
    const stats = computeReviewStats(sampleReviews);
    expect(stats.verified + stats.pending).toBe(stats.total);
  });
});

describe("filterReviews", () => {
  it("returns all reviews for the 'all' filter", () => {
    expect(filterReviews(sampleReviews, "all")).toHaveLength(5);
  });

  it("returns only language-verified reviews for the 'verified' filter", () => {
    const result = filterReviews(sampleReviews, "verified");
    expect(result).toHaveLength(2);
    expect(result.every((r) => r.isLanguageVerified)).toBe(true);
  });

  it("returns only pending reviews for the 'unverified' filter", () => {
    const result = filterReviews(sampleReviews, "unverified");
    expect(result).toHaveLength(3);
    expect(result.every((r) => !r.isLanguageVerified)).toBe(true);
  });

  it("does not mutate the input list", () => {
    const input = sampleReviews;
    const result = filterReviews(input, "verified");
    expect(input).toHaveLength(sampleReviews.length);
    expect(result).not.toBe(input);
  });

  it("handles an empty list for every filter", () => {
    const filters: ReviewFilter[] = ["all", "verified", "unverified"];
    for (const filter of filters) {
      expect(filterReviews([], filter)).toEqual([]);
    }
  });
});
