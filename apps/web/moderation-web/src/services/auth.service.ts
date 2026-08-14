import type { LoginRequest, LoginResponse, User } from "@/types";
import { request, setToken } from "./http.js";

function toUser(user: {
  id: string;
  name: string;
  email: string;
  role: string;
}): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role === "admin" ? "admin" : "moderator",
  };
}

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const result = await request<{ sessionToken: string; user: User }>(
      "/v1/auth/login",
      { method: "POST", body: data, auth: false },
    );
    setToken(result.sessionToken);
    return { user: result.user, token: result.sessionToken };
  },

  async logout(): Promise<void> {
    try {
      await request("/v1/auth/logout", { method: "POST" });
    } finally {
      setToken(null);
    }
  },

  async getProfile(): Promise<User> {
    const { user } = await request<{ user: User }>("/v1/auth/me");
    return toUser(user);
  },

  async updateProfile(
    data: Partial<Pick<User, "name" | "avatar">>,
  ): Promise<User> {
    const user = await this.getProfile();
    return { ...user, ...data };
  },
};
