import type { Media } from "@/types";
import { request } from "./http.js";

function toMedia(m: {
  id: string;
  restaurantId: string;
  restaurantName: string;
  url: string;
  type: "image" | "video";
  title: string;
  isVerified: boolean;
  createdAt: string | Date;
}): Media {
  return {
    id: m.id,
    restaurantId: m.restaurantId,
    restaurantName: m.restaurantName,
    url: m.url,
    type: m.type,
    title: m.title,
    isVerified: m.isVerified,
    createdAt: new Date(m.createdAt),
  };
}

export const mediaService = {
  async getAll(): Promise<Media[]> {
    const media = await request<Record<string, unknown>[]>("/v1/media");
    return media.map((m) => toMedia(m as Parameters<typeof toMedia>[0]));
  },

  async setVerified(id: string, isVerified: boolean): Promise<Media> {
    const m = await request<Record<string, unknown>>(
      `/v1/media/${id}/verified`,
      {
        method: "PATCH",
        body: { isVerified },
      },
    );
    return toMedia(m as Parameters<typeof toMedia>[0]);
  },

  async undo(id: string): Promise<Media> {
    const m = await request<Record<string, unknown>>(`/v1/media/${id}/undo`, {
      method: "POST",
    });
    return toMedia(m as Parameters<typeof toMedia>[0]);
  },

  hasUndo(): boolean {
    return false;
  },
};
