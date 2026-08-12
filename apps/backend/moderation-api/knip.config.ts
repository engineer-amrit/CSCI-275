import pkg from './package.json' with { type: 'json' }
import type { KnipConfig } from 'knip'
import { getDeps } from '@utils/config'
const { devDependencies, dependencies } = pkg

export default {
  ignoreDependencies: getDeps(
    { ...dependencies, ...devDependencies },
    'workspace',
    ['@types/common', '@config/ts'],
  ),
  ignoreBinaries: ['knip'],
  project: ['./src/**/*.ts', './test/**/*.ts'],
  entry: ['./src/main.ts', 'test/**/*.e2e-spec.ts', 'src/**/*.spec.ts'],
  paths: {
    '@/*': ['./src/*'],
  },
} satisfies KnipConfig
