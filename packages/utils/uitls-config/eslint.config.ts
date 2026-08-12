import { config } from '@config/eslint/node'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  ...config,
  {
    files: ['src/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
])
