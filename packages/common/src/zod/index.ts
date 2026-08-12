export type UnionFallback =
  | {
      type: 'REQUIRED_FIELD'
      path: string[]
      when: {
        exists: string[]
      }
      message: string
    }
  | {
      type: 'REQUIRE_ONE_OF'
      paths: string[][]
      message: string
    }
