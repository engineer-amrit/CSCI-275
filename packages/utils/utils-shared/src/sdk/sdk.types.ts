import type {
  ContractGroupDef,
  InferSchema,
  ContractRouteDef,
  GetRes,
} from 'common'

type RemoveNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K]
}
export type SDKMethods<T extends ContractGroupDef> = {
  [K in keyof T['routes']]: SDKFunction<T['routes'][K]>
}

export type SDKFunction<T extends ContractRouteDef> = T extends {
  request: infer R
}
  ? keyof GetSDKReq<R> extends never
    ? () => Promise<GetRes<T>>
    : (req: GetSDKReq<R>) => Promise<GetRes<T>>
  : () => Promise<GetRes<T>>

export type GetSDKReq<R> = RemoveNever<{
  body: R extends { body: infer B } ? InferSchema<B> : never

  query: R extends { query: infer Q } ? InferSchema<Q> : never

  params: R extends { params: infer P } ? InferSchema<P> : never
}>
