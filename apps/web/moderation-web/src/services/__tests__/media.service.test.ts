import { describe, it, expect } from "vitest";
import { mediaService } from "@/services";

describe("mediaService", () => {
  describe("getAll", () => {
    it("returns a list of media", async () => {
      const media = await mediaService.getAll();
      expect(media.length).toBeGreaterThan(0);
      expect(media[0]).toHaveProperty("id");
      expect(media[0]).toHaveProperty("isVerified");
    });
  });

  describe("setVerified", () => {
    it("marks media as verified", async () => {
      const media = await mediaService.setVerified("med-1", true);
      expect(media.isVerified).toBe(true);
    });

    it("marks media as unverified", async () => {
      const media = await mediaService.setVerified("med-1", false);
      expect(media.isVerified).toBe(false);
    });

    it("throws when the media is not found", async () => {
      await expect(mediaService.setVerified("missing", true)).rejects.toThrow(
        "Media not found",
      );
    });
  });

  describe("undo", () => {
    it("reverts the last moderation action for media", async () => {
      await mediaService.setVerified("med-2", true);
      const reverted = await mediaService.undo("med-2");
      expect(reverted.isVerified).toBe(false);
    });

    it("throws when there is no action to undo", async () => {
      await expect(mediaService.undo("med-7")).rejects.toThrow(
        "No recent moderation action to undo for this media",
      );
    });
  });
});
