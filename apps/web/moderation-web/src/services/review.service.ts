import type { Review } from "@/types";

const MOCK_REVIEWS: Review[] = [
  {
    id: "rev-1",
    restaurantId: "rest-1",
    restaurantName: "Sushi Heaven",
    userId: "user-1",
    rating: 4.0,
    content:
      "Amazing sushi, the salmon was incredibly fresh and the service was quick.",
    language: "English",
    isLanguageVerified: true,
    isValid: true,
    createdAt: new Date("2026-07-05"),
  },
  {
    id: "rev-2",
    restaurantId: "rest-1",
    restaurantName: "Sushi Heaven",
    userId: "user-2",
    rating: 3.5,
    content: "Very good but the wait for a table was a bit long.",
    language: "English",
    isLanguageVerified: false,
    isValid: true,
    createdAt: new Date("2026-07-06"),
  },
  {
    id: "rev-3",
    restaurantId: "rest-1",
    restaurantName: "Sushi Heaven",
    userId: "user-3",
    rating: 5.0,
    content:
      "Le meilleur sushi de la ville, je recommande vivement le plateau royal !",
    language: "French",
    isLanguageVerified: false,
    isValid: true,
    createdAt: new Date("2026-07-07"),
  },
  {
    id: "rev-4",
    restaurantId: "rest-2",
    restaurantName: "Pasta Palace",
    userId: "user-1",
    rating: 4.5,
    content: "Delicious homemade pasta, the carbonara is a must-try.",
    language: "English",
    isLanguageVerified: true,
    isValid: true,
    createdAt: new Date("2026-06-18"),
  },
  {
    id: "rev-5",
    restaurantId: "rest-2",
    restaurantName: "Pasta Palace",
    userId: "user-4",
    rating: 2.5,
    content: "平均的体验，价格偏高，份量较少。",
    language: "Chinese",
    isLanguageVerified: false,
    isValid: true,
    createdAt: new Date("2026-06-20"),
  },
  {
    id: "rev-6",
    restaurantId: "rest-3",
    restaurantName: "Curry House",
    userId: "user-2",
    rating: 4.0,
    content: "Great butter chicken and naan, flavors were authentic and bold.",
    language: "English",
    isLanguageVerified: true,
    isValid: true,
    createdAt: new Date("2026-07-12"),
  },
  {
    id: "rev-7",
    restaurantId: "rest-3",
    restaurantName: "Curry House",
    userId: "user-3",
    rating: 3.0,
    content:
      "Das Curry war gut, aber die Portion war etwas klein für den Preis.",
    language: "German",
    isLanguageVerified: false,
    isValid: true,
    createdAt: new Date("2026-07-13"),
  },
  {
    id: "rev-8",
    restaurantId: "rest-4",
    restaurantName: "Burger Barn",
    userId: "user-1",
    rating: 4.0,
    content: "Juicy burgers and crispy fries, perfect casual spot.",
    language: "English",
    isLanguageVerified: true,
    isValid: true,
    createdAt: new Date("2026-07-21"),
  },
  {
    id: "rev-9",
    restaurantId: "rest-4",
    restaurantName: "Burger Barn",
    userId: "user-5",
    rating: 4.5,
    content: "¡Las hamburguesas son espectaculares y el servicio es excelente!",
    language: "Spanish",
    isLanguageVerified: false,
    isValid: true,
    createdAt: new Date("2026-07-22"),
  },
  {
    id: "rev-10",
    restaurantId: "rest-5",
    restaurantName: "Le Petit Bistro",
    userId: "user-2",
    rating: 4.0,
    content: "Elegant French dining, the duck confit was perfectly cooked.",
    language: "English",
    isLanguageVerified: true,
    isValid: true,
    createdAt: new Date("2026-05-25"),
  },
];

interface ModerationAction {
  reviewId: string;
  action: "verified" | "flagged";
  at: Date;
}

const actionHistory: ModerationAction[] = [];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const reviewService = {
  async getAll(): Promise<Review[]> {
    await delay(500);
    return MOCK_REVIEWS;
  },

  async setLanguageVerified(id: string, verified: boolean): Promise<Review> {
    await delay(400);
    const review = MOCK_REVIEWS.find((r) => r.id === id);
    if (!review) throw new Error("Review not found");
    if (review.isLanguageVerified === verified) return review;
    review.isLanguageVerified = verified;
    actionHistory.push({
      reviewId: id,
      action: verified ? "verified" : "flagged",
      at: new Date(),
    });
    return review;
  },

  async undo(id: string): Promise<Review> {
    await delay(400);
    let index = -1;
    for (let i = actionHistory.length - 1; i >= 0; i--) {
      const entry = actionHistory[i];
      if (entry?.reviewId === id) {
        index = i;
        break;
      }
    }
    if (index === -1) {
      throw new Error("No recent moderation action to undo for this review");
    }
    const action = actionHistory[index];
    if (!action) {
      throw new Error("No recent moderation action to undo for this review");
    }
    actionHistory.splice(index, 1);
    const review = MOCK_REVIEWS.find((r) => r.id === id);
    if (!review) throw new Error("Review not found");
    review.isLanguageVerified = action.action === "verified" ? false : true;
    return review;
  },
};
