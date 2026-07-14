import type { Config } from "prettier";

export const baseConfig = {
  arrowParens: "always",
  bracketSpacing: true,
  endOfLine: "lf",
  jsxSingleQuote: true,
  printWidth: 80,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "all",
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
} as const satisfies Config;
