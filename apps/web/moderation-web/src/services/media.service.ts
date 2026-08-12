import type { Media } from "@/types";

const MOCK_MEDIA: Media[] = [
  {
    id: "med-1",
    restaurantId: "rest-1",
    restaurantName: "Sushi Heaven",
    url: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&h=400&fit=crop",
    type: "image",
    title: "Fresh salmon nigiri plate",
    isVerified: true,
    createdAt: new Date("2026-07-02"),
  },
  {
    id: "med-2",
    restaurantId: "rest-1",
    restaurantName: "Sushi Heaven",
    url: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&h=400&fit=crop",
    type: "image",
    title: "Interior seating area",
    isVerified: false,
    createdAt: new Date("2026-07-03"),
  },
  {
    id: "med-3",
    restaurantId: "rest-2",
    restaurantName: "Pasta Palace",
    url: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&h=400&fit=crop",
    type: "image",
    title: "Carbonara pasta bowl",
    isVerified: true,
    createdAt: new Date("2026-06-16"),
  },
  {
    id: "med-4",
    restaurantId: "rest-3",
    restaurantName: "Curry House",
    url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop",
    type: "image",
    title: "Butter chicken with naan",
    isVerified: false,
    createdAt: new Date("2026-07-11"),
  },
  {
    id: "med-5",
    restaurantId: "rest-4",
    restaurantName: "Burger Barn",
    url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop",
    type: "image",
    title: "Classic cheeseburger",
    isVerified: true,
    createdAt: new Date("2026-07-21"),
  },
  {
    id: "med-6",
    restaurantId: "rest-4",
    restaurantName: "Burger Barn",
    url: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600&h=400&fit=crop",
    type: "image",
    title: "Milkshake special",
    isVerified: false,
    createdAt: new Date("2026-07-22"),
  },
  {
    id: "med-7",
    restaurantId: "rest-5",
    restaurantName: "Le Petit Bistro",
    url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
    type: "image",
    title: "Duck confit plated dinner",
    isVerified: true,
    createdAt: new Date("2026-05-22"),
  },
];

interface ModerationAction {
  mediaId: string;
  action: "verified" | "unverified";
  at: Date;
}

const actionHistory: ModerationAction[] = [];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const mediaService = {
  async getAll(): Promise<Media[]> {
    await delay(500);
    return MOCK_MEDIA;
  },

  async setVerified(id: string, isVerified: boolean): Promise<Media> {
    await delay(400);
    const media = MOCK_MEDIA.find((m) => m.id === id);
    if (!media) throw new Error("Media not found");
    if (media.isVerified === isVerified) return media;
    media.isVerified = isVerified;
    actionHistory.push({
      mediaId: id,
      action: isVerified ? "verified" : "unverified",
      at: new Date(),
    });
    return media;
  },

  async undo(id: string): Promise<Media> {
    await delay(400);
    let index = -1;
    for (let i = actionHistory.length - 1; i >= 0; i--) {
      const entry = actionHistory[i];
      if (entry?.mediaId === id) {
        index = i;
        break;
      }
    }
    if (index === -1) {
      throw new Error("No recent moderation action to undo for this media");
    }
    const action = actionHistory[index];
    if (!action) {
      throw new Error("No recent moderation action to undo for this media");
    }
    actionHistory.splice(index, 1);
    const media = MOCK_MEDIA.find((m) => m.id === id);
    if (!media) throw new Error("Media not found");
    media.isVerified = action.action === "verified" ? false : true;
    return media;
  },

  hasUndo(id: string): boolean {
    return actionHistory.some((a) => a.mediaId === id);
  },
};
