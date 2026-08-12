import type { Restaurant, Review, VerificationResult } from "@/types";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const FLAGGED_WORDS = ["idiot", "stupid", "sucks", "trash", "disgusting"];

const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: "rest-1",
    name: "Sushi Heaven",
    description:
      "Authentic Japanese sushi bar serving fresh nigiri, sashimi, and specialty rolls in a cozy setting.",
    cuisine: "Japanese",
    location: "Vancouver, BC",
    isVerified: false,
    dataStatus: "verified",
    flaggedWords: [],
    createdAt: new Date("2026-07-01"),
  },
  {
    id: "rest-2",
    name: "Pasta Palace",
    description:
      "Homemade pasta and wood-fired pizza inspired by the streets of Naples.",
    cuisine: "Italian",
    location: "Burnaby, BC",
    isVerified: true,
    dataStatus: "pending",
    flaggedWords: [],
    createdAt: new Date("2026-06-15"),
  },
  {
    id: "rest-3",
    name: "Curry House",
    description:
      "The place is literally trash, do not waste your time with this stupid menu.",
    cuisine: "Indian",
    location: "Surrey, BC",
    isVerified: false,
    dataStatus: "flagged",
    flaggedWords: ["trash", "stupid"],
    createdAt: new Date("2026-07-10"),
  },
  {
    id: "rest-4",
    name: "Burger Barn",
    description:
      "Classic American burgers, hand-cut fries, and thick shakes served fast and fresh.",
    cuisine: "American",
    location: "Richmond, BC",
    isVerified: false,
    dataStatus: "pending",
    flaggedWords: [],
    createdAt: new Date("2026-07-20"),
  },
  {
    id: "rest-5",
    name: "Le Petit Bistro",
    description:
      "Elegant French bistro offering refined dishes and an extensive wine list.",
    cuisine: "French",
    location: "Vancouver, BC",
    isVerified: true,
    dataStatus: "verified",
    flaggedWords: [],
    createdAt: new Date("2026-05-20"),
  },
];

const MOCK_REVIEWS: Review[] = [
  {
    id: "rev-1",
    restaurantId: "rest-1",
    restaurantName: "Sushi Heaven",
    userId: "user-1",
    rating: 3.0,
    content: "Great food and friendly staff.",
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
    content: "Nice spot for a casual dinner.",
    language: "English",
    isLanguageVerified: true,
    isValid: true,
    createdAt: new Date("2026-07-06"),
  },
  {
    id: "rev-3",
    restaurantId: "rest-1",
    restaurantName: "Sushi Heaven",
    userId: "user-3",
    rating: 2.5,
    content: "Average, nothing special.",
    language: "English",
    isLanguageVerified: true,
    isValid: true,
    createdAt: new Date("2026-07-07"),
  },
  {
    id: "rev-4",
    restaurantId: "rest-1",
    restaurantName: "Sushi Heaven",
    userId: "user-4",
    rating: 4.0,
    content: "Delicious rolls, will come back.",
    language: "English",
    isLanguageVerified: true,
    isValid: true,
    createdAt: new Date("2026-07-08"),
  },
  {
    id: "rev-5",
    restaurantId: "rest-3",
    restaurantName: "Curry House",
    userId: "user-1",
    rating: 3.5,
    content: "Decent curry, good value.",
    language: "English",
    isLanguageVerified: true,
    isValid: true,
    createdAt: new Date("2026-07-12"),
  },
  {
    id: "rev-6",
    restaurantId: "rest-3",
    restaurantName: "Curry House",
    userId: "user-2",
    rating: 2.0,
    content: "Too spicy for me.",
    language: "English",
    isLanguageVerified: true,
    isValid: true,
    createdAt: new Date("2026-07-13"),
  },
  {
    id: "rev-7",
    restaurantId: "rest-3",
    restaurantName: "Curry House",
    userId: "user-3",
    rating: 4.0,
    content: "Flavorful and authentic.",
    language: "English",
    isLanguageVerified: true,
    isValid: true,
    createdAt: new Date("2026-07-14"),
  },
  {
    id: "rev-8",
    restaurantId: "rest-4",
    restaurantName: "Burger Barn",
    userId: "user-1",
    rating: 4.5,
    content: "Best burger in town.",
    language: "English",
    isLanguageVerified: true,
    isValid: true,
    createdAt: new Date("2026-07-21"),
  },
  {
    id: "rev-9",
    restaurantId: "rest-4",
    restaurantName: "Burger Barn",
    userId: "user-2",
    rating: 4.0,
    content: "Crispy fries and juicy patties.",
    language: "English",
    isLanguageVerified: true,
    isValid: true,
    createdAt: new Date("2026-07-22"),
  },
  {
    id: "rev-10",
    restaurantId: "rest-4",
    restaurantName: "Burger Barn",
    userId: "user-3",
    rating: 3.5,
    content: "Good but a bit greasy.",
    language: "English",
    isLanguageVerified: true,
    isValid: true,
    createdAt: new Date("2026-07-23"),
  },
  {
    id: "rev-11",
    restaurantId: "rest-4",
    restaurantName: "Burger Barn",
    userId: "user-4",
    rating: 5.0,
    content: "Absolutely loved the milkshakes.",
    language: "English",
    isLanguageVerified: true,
    isValid: true,
    createdAt: new Date("2026-07-24"),
  },
  {
    id: "rev-12",
    restaurantId: "rest-4",
    restaurantName: "Burger Barn",
    userId: "user-5",
    rating: 4.0,
    content: "Great family spot.",
    language: "English",
    isLanguageVerified: true,
    isValid: true,
    createdAt: new Date("2026-07-25"),
  },
];

export const restaurantService = {
  async getAll(): Promise<Restaurant[]> {
    await delay(600);
    return MOCK_RESTAURANTS;
  },

  async getById(id: string): Promise<Restaurant | undefined> {
    await delay(400);
    return MOCK_RESTAURANTS.find((r) => r.id === id);
  },

  async getReviews(restaurantId: string): Promise<Review[]> {
    await delay(400);
    return MOCK_REVIEWS.filter((r) => r.restaurantId === restaurantId);
  },

  async verify(restaurantId: string): Promise<VerificationResult> {
    await delay(800);
    const restaurant = MOCK_RESTAURANTS.find((r) => r.id === restaurantId);
    if (!restaurant) throw new Error("Restaurant not found");

    if (restaurant.isVerified) {
      return {
        restaurantId,
        isVerified: true,
        totalReviews: 0,
        validReviews: 0,
        distinctUsers: 0,
        averageRating: 0,
        criteria: {
          minReviews: 5,
          minDistinctUsers: 5,
          minAverageRating: 2.5,
        },
      };
    }

    const reviews = MOCK_REVIEWS.filter(
      (r) => r.restaurantId === restaurantId && r.isValid,
    );
    const totalReviews = reviews.length;
    const distinctUsers = new Set(reviews.map((r) => r.userId)).size;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    const isVerified =
      totalReviews >= 5 && distinctUsers >= 5 && averageRating >= 2.5;

    if (isVerified) restaurant.isVerified = true;

    return {
      restaurantId,
      isVerified,
      totalReviews,
      validReviews: totalReviews,
      distinctUsers,
      averageRating: Math.round(averageRating * 100) / 100,
      criteria: {
        minReviews: 5,
        minDistinctUsers: 5,
        minAverageRating: 2.5,
      },
    };
  },

  async checkData(restaurantId: string): Promise<Restaurant> {
    await delay(600);
    const restaurant = MOCK_RESTAURANTS.find((r) => r.id === restaurantId);
    if (!restaurant) throw new Error("Restaurant not found");

    const text = `${restaurant.name} ${restaurant.description}`.toLowerCase();
    const flagged = FLAGGED_WORDS.filter((word) => text.includes(word));

    restaurant.flaggedWords = flagged;
    restaurant.dataStatus = flagged.length > 0 ? "flagged" : "verified";
    return restaurant;
  },

  async setDataStatus(
    restaurantId: string,
    status: Restaurant["dataStatus"],
  ): Promise<Restaurant> {
    await delay(400);
    const restaurant = MOCK_RESTAURANTS.find((r) => r.id === restaurantId);
    if (!restaurant) throw new Error("Restaurant not found");
    restaurant.dataStatus = status;
    if (status === "verified") restaurant.flaggedWords = [];
    return restaurant;
  },
};
