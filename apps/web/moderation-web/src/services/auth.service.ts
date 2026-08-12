import type { LoginRequest, LoginResponse, User } from "@/types";

const MOCK_USER: User = {
  id: "1",
  name: "Amrit Singh",
  email: "admin@moderation.com",
  role: "admin",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=amrit",
};

const MOCK_TOKEN = "mock-jwt-token-abc123";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    await delay(800);

    if (data.email === "admin@moderation.com" && data.password === "admin123") {
      return { user: MOCK_USER, token: MOCK_TOKEN };
    }

    if (data.email && data.password) {
      return {
        user: {
          ...MOCK_USER,
          email: data.email,
          name: data.email.split("@")[0] ?? data.email,
        },
        token: MOCK_TOKEN,
      };
    }

    throw new Error("Invalid credentials");
  },

  async logout(): Promise<void> {
    await delay(300);
  },

  async getProfile(): Promise<User> {
    await delay(500);
    return MOCK_USER;
  },

  async updateProfile(
    data: Partial<Pick<User, "name" | "avatar">>,
  ): Promise<User> {
    await delay(500);
    return { ...MOCK_USER, ...data };
  },
};
