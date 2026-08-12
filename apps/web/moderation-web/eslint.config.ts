import { config } from "@config/eslint/react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  ...config,
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    rules: {
      "no-console": "off",
    },
  },
]);
