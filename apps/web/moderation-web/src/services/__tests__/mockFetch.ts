import { vi } from "vitest";

interface MockRestaurant {
  id: string;
  name: string;
  cuisine: string;
  location: string;
  description: string;
  isVerified: boolean;
  dataStatus: "pending" | "verified" | "flagged";
  flaggedWords: string[];
  createdAt: string;
}

interface MockReview {
  id: string;
  restaurantId: string;
  userId: string;
  rating: number;
  content: string;
  createdAt: string;
}

interface MockMedia {
  id: string;
  restaurantId: string;
  restaurantName: string;
  url: string;
  type: "image" | "video";
  title: string;
  isVerified: boolean;
  createdAt: string;
}

const restaurants: MockRestaurant[] = [
  {
    id: "rest-1",
    name: "Sushi Heaven",
    cuisine: "Japanese",
    location: "Vancouver, BC",
    description: "Authentic Japanese sushi bar.",
    isVerified: false,
    dataStatus: "pending",
    flaggedWords: [],
    createdAt: "2026-07-01T00:00:00.000Z",
  },
  {
    id: "rest-2",
    name: "Pasta Palace",
    cuisine: "Italian",
    location: "Burnaby, BC",
    description: "Homemade pasta and wood-fired pizza.",
    isVerified: true,
    dataStatus: "pending",
    flaggedWords: [],
    createdAt: "2026-06-15T00:00:00.000Z",
  },
  {
    id: "rest-3",
    name: "Curry House",
    cuisine: "Indian",
    location: "Surrey, BC",
    description:
      "The place is literally trash, do not waste your time with this stupid menu.",
    isVerified: false,
    dataStatus: "flagged",
    flaggedWords: ["trash", "stupid"],
    createdAt: "2026-07-10T00:00:00.000Z",
  },
  {
    id: "rest-4",
    name: "Burger Barn",
    cuisine: "American",
    location: "Richmond, BC",
    description: "Classic American burgers.",
    isVerified: false,
    dataStatus: "pending",
    flaggedWords: [],
    createdAt: "2026-07-20T00:00:00.000Z",
  },
  {
    id: "rest-5",
    name: "Le Petit Bistro",
    cuisine: "French",
    location: "Vancouver, BC",
    description: "Elegant French bistro.",
    isVerified: true,
    dataStatus: "verified",
    flaggedWords: [],
    createdAt: "2026-05-20T00:00:00.000Z",
  },
];

const reviews: MockReview[] = [
  {
    id: "rev-1",
    restaurantId: "rest-1",
    userId: "user-1",
    rating: 3,
    content: "Great food.",
    createdAt: "2026-07-05T00:00:00.000Z",
  },
  {
    id: "rev-2",
    restaurantId: "rest-1",
    userId: "user-2",
    rating: 3.5,
    content: "Nice spot.",
    createdAt: "2026-07-06T00:00:00.000Z",
  },
  {
    id: "rev-3",
    restaurantId: "rest-1",
    userId: "user-3",
    rating: 2.5,
    content: "Average.",
    createdAt: "2026-07-07T00:00:00.000Z",
  },
  {
    id: "rev-4",
    restaurantId: "rest-1",
    userId: "user-4",
    rating: 4,
    content: "Delicious.",
    createdAt: "2026-07-08T00:00:00.000Z",
  },
  {
    id: "rev-5",
    restaurantId: "rest-4",
    userId: "user-1",
    rating: 4.5,
    content: "Best burger.",
    createdAt: "2026-07-21T00:00:00.000Z",
  },
  {
    id: "rev-6",
    restaurantId: "rest-4",
    userId: "user-2",
    rating: 4,
    content: "Crispy fries.",
    createdAt: "2026-07-22T00:00:00.000Z",
  },
  {
    id: "rev-7",
    restaurantId: "rest-4",
    userId: "user-3",
    rating: 3.5,
    content: "Good but greasy.",
    createdAt: "2026-07-23T00:00:00.000Z",
  },
  {
    id: "rev-8",
    restaurantId: "rest-4",
    userId: "user-4",
    rating: 5,
    content: "Loved it.",
    createdAt: "2026-07-24T00:00:00.000Z",
  },
  {
    id: "rev-9",
    restaurantId: "rest-4",
    userId: "user-5",
    rating: 4,
    content: "Great family spot.",
    createdAt: "2026-07-25T00:00:00.000Z",
  },
  {
    id: "rev-10",
    restaurantId: "rest-5",
    userId: "user-2",
    rating: 4,
    content: "Elegant dining.",
    createdAt: "2026-05-25T00:00:00.000Z",
  },
];

const media: MockMedia[] = [
  {
    id: "med-1",
    restaurantId: "rest-1",
    restaurantName: "Sushi Heaven",
    url: "https://example.com/a.jpg",
    type: "image",
    title: "Nigiri",
    isVerified: true,
    createdAt: "2026-07-02T00:00:00.000Z",
  },
  {
    id: "med-2",
    restaurantId: "rest-1",
    restaurantName: "Sushi Heaven",
    url: "https://example.com/b.jpg",
    type: "image",
    title: "Interior",
    isVerified: false,
    createdAt: "2026-07-03T00:00:00.000Z",
  },
  {
    id: "med-7",
    restaurantId: "rest-5",
    restaurantName: "Le Petit Bistro",
    url: "https://example.com/c.jpg",
    type: "image",
    title: "Duck confit",
    isVerified: true,
    createdAt: "2026-05-22T00:00:00.000Z",
  },
];

const reviewLang = new Map<string, boolean>();
const reviewActions: { reviewId: string; verified: boolean }[] = [];
const mediaState = new Map<string, boolean>();
const mediaActions: { mediaId: string; verified: boolean }[] = [];

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function notFound(message: string): Response {
  return json(404, { message });
}

function verificationResult(restaurantId: string) {
  const rest = restaurants.find((r) => r.id === restaurantId);
  if (!rest) return notFound("Restaurant not found");
  if (rest.isVerified) {
    return json(200, {
      restaurantId,
      isVerified: true,
      totalReviews: 0,
      validReviews: 0,
      distinctUsers: 0,
      averageRating: 0,
      criteria: { minReviews: 5, minDistinctUsers: 5, minAverageRating: 2.5 },
    });
  }
  const list = reviews.filter((r) => r.restaurantId === restaurantId);
  const totalReviews = list.length;
  const distinctUsers = new Set(list.map((r) => r.userId)).size;
  const averageRating =
    totalReviews > 0
      ? list.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;
  const isVerified =
    totalReviews >= 5 && distinctUsers >= 5 && averageRating >= 2.5;
  return json(200, {
    restaurantId,
    isVerified,
    totalReviews,
    validReviews: totalReviews,
    distinctUsers,
    averageRating,
    criteria: { minReviews: 5, minDistinctUsers: 5, minAverageRating: 2.5 },
  });
}

function checkData(restaurantId: string) {
  const rest = restaurants.find((r) => r.id === restaurantId);
  if (!rest) return notFound("Restaurant not found");
  const dataStatus = rest.flaggedWords.length > 0 ? "flagged" : "verified";
  return json(200, { ...rest, dataStatus, flaggedWords: rest.flaggedWords });
}

function setDataStatus(restaurantId: string, status: string) {
  const rest = restaurants.find((r) => r.id === restaurantId);
  if (!rest) return notFound("Restaurant not found");
  rest.dataStatus = status as MockRestaurant["dataStatus"];
  if (status === "verified") rest.flaggedWords = [];
  return json(200, rest);
}

function reviewLanguage(id: string, verified: boolean) {
  const review = reviews.find((r) => r.id === id);
  if (!review) return notFound("Review not found");
  reviewLang.set(id, verified);
  reviewActions.push({ reviewId: id, verified });
  return json(200, {
    ...review,
    language: "English",
    isLanguageVerified: verified,
  });
}

function reviewUndo(id: string) {
  let index = -1;
  for (let i = reviewActions.length - 1; i >= 0; i--) {
    if (reviewActions[i]?.reviewId === id) {
      index = i;
      break;
    }
  }
  if (index === -1)
    return notFound("No recent moderation action to undo for this review");
  reviewActions.splice(index, 1);
  const previous = [...reviewActions].reverse().find((a) => a.reviewId === id);
  reviewLang.set(id, previous ? previous.verified : false);
  const review = reviews.find((r) => r.id === id);
  if (!review) return notFound("Review not found");
  return json(200, {
    ...review,
    language: "English",
    isLanguageVerified: reviewLang.get(id) ?? false,
  });
}

function mediaVerified(id: string, isVerified: boolean) {
  const item = media.find((m) => m.id === id);
  if (!item) return notFound("Media not found");
  if (item.isVerified !== isVerified) {
    item.isVerified = isVerified;
    mediaActions.push({ mediaId: id, verified: isVerified });
  }
  return json(200, item);
}

function mediaUndo(id: string) {
  let index = -1;
  for (let i = mediaActions.length - 1; i >= 0; i--) {
    if (mediaActions[i]?.mediaId === id) {
      index = i;
      break;
    }
  }
  if (index === -1)
    return notFound("No recent moderation action to undo for this media");
  const action = mediaActions[index]!;
  mediaActions.splice(index, 1);
  const item = media.find((m) => m.id === id);
  if (!item) return notFound("Media not found");
  item.isVerified = !action.verified;
  return json(200, item);
}

export function installMockFetch() {
  const fetchMock = vi.fn(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = new URL(String(input), "http://localhost");
      const path = url.pathname.replace(/^\/api/, "");
      const method = init?.method ?? "GET";
      const body = init?.body
        ? (JSON.parse(String(init.body)) as Record<string, unknown>)
        : {};

      if (method === "GET" && path === "/v1/restaurant")
        return json(200, restaurants);
      if (
        method === "PATCH" &&
        /^\/v1\/restaurant\/verify\/[^/]+$/.test(path)
      ) {
        return verificationResult(path.split("/").pop()!);
      }
      const dataCheck = path.match(/^\/v1\/restaurant\/([^/]+)\/data-check$/);
      if (method === "GET" && dataCheck) return checkData(dataCheck[1]!);
      const dataStatus = path.match(/^\/v1\/restaurant\/([^/]+)\/data-status$/);
      if (method === "PATCH" && dataStatus)
        return setDataStatus(dataStatus[1]!, String(body.status ?? "pending"));
      const getById = path.match(/^\/v1\/restaurant\/([^/]+)$/);
      if (method === "GET" && getById) {
        const rest = restaurants.find((r) => r.id === getById[1]);
        return rest ? json(200, rest) : notFound("Restaurant not found");
      }

      if (method === "GET" && path === "/v1/review") {
        return json(
          200,
          reviews.map((r) => ({
            ...r,
            language: "English",
            isLanguageVerified: reviewLang.get(r.id) ?? false,
          })),
        );
      }
      const reviewLangMatch = path.match(/^\/v1\/review\/([^/]+)\/language$/);
      if (method === "PATCH" && reviewLangMatch)
        return reviewLanguage(reviewLangMatch[1]!, body.verified === true);
      const reviewUndoMatch = path.match(/^\/v1\/review\/([^/]+)\/undo$/);
      if (method === "POST" && reviewUndoMatch)
        return reviewUndo(reviewUndoMatch[1]!);

      if (method === "GET" && path === "/v1/media") return json(200, media);
      const mediaVerifiedMatch = path.match(/^\/v1\/media\/([^/]+)\/verified$/);
      if (method === "PATCH" && mediaVerifiedMatch)
        return mediaVerified(mediaVerifiedMatch[1]!, body.isVerified === true);
      const mediaUndoMatch = path.match(/^\/v1\/media\/([^/]+)\/undo$/);
      if (method === "POST" && mediaUndoMatch)
        return mediaUndo(mediaUndoMatch[1]!);

      return notFound(`No mock route for ${method} ${path}`);
    },
  );

  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

export function resetMockState() {
  reviewLang.clear();
  reviewActions.length = 0;
  mediaState.clear();
  mediaActions.length = 0;
  restaurants.forEach((r) => {
    r.isVerified = r.id === "rest-2" || r.id === "rest-5";
  });
}
