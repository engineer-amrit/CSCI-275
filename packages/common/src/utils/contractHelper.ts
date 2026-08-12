import { z } from 'zod'
import { RoutesDef } from '../contract/index.js'

export type InferSchema<T> = T extends z.ZodTypeAny ? z.infer<T> : never

export type GetRes<T> = T extends {
  response: infer R
}
  ? R extends new (...args: any) => any
    ? DeepExpand<InstanceType<R>>
    : R
  : any

export type IController<T extends RoutesDef> = {
  [K in keyof T]: (...args: any[]) => Promise<GetRes<T[K]>>
}

export type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined
  | Primitive[]

type Builtin = Primitive | Date | RegExp

export type DeepExpand<T> = T extends Builtin
  ? T
  : T extends readonly (infer U)[]
    ? DeepExpand<U>[]
    : T extends object
      ? {
          [K in keyof T]: DeepExpand<T[K]>
        } & {}
      : T

export type Pretty<T> = {} & {
  [K in keyof T]: T[K]
}
