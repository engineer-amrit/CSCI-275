import { describe, it, expect } from "vitest";
import { reviewService } from "@/services";

describe("reviewService", () => {
  describe("getAll", () => {
    it("returns a list of reviews", async () => {
      const reviews = await reviewService.getAll();
      expect(reviews.length).toBeGreaterThan(0);
      expect(reviews[0]).toHaveProperty("id");
      expect(reviews[0]).toHaveProperty("content");
      expect(reviews[0]).toHaveProperty("language");
    });
  });

  describe("setLanguageVerified", () => {
    it("marks a review language as verified", async () => {
      const review = await reviewService.setLanguageVerified("rev-1", true);
      expect(review.isLanguageVerified).toBe(true);
    });

    it("flags a review language as unverified", async () => {
      const review = await reviewService.setLanguageVerified("rev-1", false);
      expect(review.isLanguageVerified).toBe(false);
    });

    it("throws when the review is not found", async () => {
      await expect(
        reviewService.setLanguageVerified("missing", true),
      ).rejects.toThrow("Review not found");
    });
  });

  describe("undo", () => {
    it("reverts the last language moderation action", async () => {
      await reviewService.setLanguageVerified("rev-2", true);
      const reverted = await reviewService.undo("rev-2");
      expect(reverted.isLanguageVerified).toBe(false);
    });

    it("throws when there is no action to undo", async () => {
      await expect(reviewService.undo("rev-10")).rejects.toThrow(
        "No recent moderation action to undo for this review",
      );
    });
  });
});
