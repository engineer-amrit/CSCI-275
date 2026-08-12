import { defineConfig } from "eslint/config";
import { config } from "@config/eslint/node"

export default defineConfig({
    ...config,
})