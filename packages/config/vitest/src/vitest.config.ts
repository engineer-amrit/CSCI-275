import { defineConfig } from "vitest/config";

export const config = defineConfig({
  test: {
    globals: true,
    environment: "node",
    clearMocks: true,
  },
});
