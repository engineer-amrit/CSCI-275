import { baseConfig } from "@config/prettier";
import type { Config } from "prettier";

export default {
  ...baseConfig,
  proseWrap: "always",
} satisfies Config;
