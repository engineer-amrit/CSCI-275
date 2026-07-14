import globals from "globals";
import { config as baseConfig } from "./base.js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export const config = defineConfig([
  ...baseConfig,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: globals.node,
      sourceType: "module",
    },
    rules: {
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/no-unsafe-assignment": "warn",
    },
  },
]);
