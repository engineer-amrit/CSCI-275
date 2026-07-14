import js from "@eslint/js";
import json from "@eslint/json";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import turbo from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

const turboConfig = turbo.configs!["flat/recommended"] as any;

export const config = defineConfig([
  { ignores: ["dist/**", "node_modules/**", "coverage/**", "out/**"] },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "prettier/prettier": ["error", { endOfLine: "auto" }],
      "no-console": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      // Enforce type-only imports for TypeScript types
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
          disallowTypeAnnotations: false,
        },
      ],
      // Prevent duplicate imports from the same module
      "no-duplicate-imports": "error",
      "@typescript-eslint/no-floating-promises": [
        "error",
        {
          ignoreVoid: false,
        },
      ],
    },
  },

  eslintPluginPrettierRecommended,
  turboConfig,
  json.configs.recommended,
]);
