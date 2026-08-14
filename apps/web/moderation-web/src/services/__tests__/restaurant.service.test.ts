import { beforeEach, describe, it, expect, vi } from "vitest";
import { restaurantService } from "@/services";
import { installMockFetch, resetMockState } from "./mockFetch";

describe("restaurantService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    installMockFetch();
    resetMockState();
  });

  describe("getAll", () => {
    it("returns a list of restaurants", async () => {
      const restaurants = await restaurantService.getAll();
      expect(restaurants.length).toBeGreaterThan(0);
      expect(restaurants[0]).toHaveProperty("id");
      expect(restaurants[0]).toHaveProperty("name");
      expect(restaurants[0]).toHaveProperty("isVerified");
    });
  });

  describe("getById", () => {
    it("returns the restaurant with the matching id", async () => {
      const restaurant = await restaurantService.getById("rest-1");
      expect(restaurant?.id).toBe("rest-1");
    });

    it("returns undefined for an unknown id", async () => {
      const restaurant = await restaurantService.getById("does-not-exist");
      expect(restaurant).toBeUndefined();
    });
  });

  describe("verify", () => {
    it("verifies a restaurant that meets the review criteria", async () => {
      const result = await restaurantService.verify("rest-4");
      expect(result.isVerified).toBe(true);
      expect(result.totalReviews).toBeGreaterThanOrEqual(5);
      expect(result.distinctUsers).toBeGreaterThanOrEqual(5);
      expect(result.averageRating).toBeGreaterThanOrEqual(2.5);
    });

    it("does not verify a restaurant below the review threshold", async () => {
      const result = await restaurantService.verify("rest-1");
      expect(result.isVerified).toBe(false);
      expect(result.totalReviews).toBeLessThan(5);
    });

    it("throws when the restaurant is not found", async () => {
      await expect(restaurantService.verify("missing")).rejects.toThrow(
        "Restaurant not found",
      );
    });
  });

  describe("checkData", () => {
    it("flags a restaurant whose data contains offensive words", async () => {
      const restaurant = await restaurantService.checkData("rest-3");
      expect(restaurant.dataStatus).toBe("flagged");
      expect(restaurant.flaggedWords.length).toBeGreaterThan(0);
    });

    it("marks a clean restaurant as verified", async () => {
      const restaurant = await restaurantService.checkData("rest-1");
      expect(restaurant.dataStatus).toBe("verified");
      expect(restaurant.flaggedWords).toEqual([]);
    });

    it("throws when the restaurant is not found", async () => {
      await expect(restaurantService.checkData("missing")).rejects.toThrow(
        "Restaurant not found",
      );
    });
  });

  describe("setDataStatus", () => {
    it("sets the data status on a restaurant", async () => {
      const restaurant = await restaurantService.setDataStatus(
        "rest-2",
        "verified",
      );
      expect(restaurant.dataStatus).toBe("verified");
      expect(restaurant.flaggedWords).toEqual([]);
    });
  });
});
