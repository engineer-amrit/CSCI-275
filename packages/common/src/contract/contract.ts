import type { ZodObject, ZodType } from 'zod'
export type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export type Verions = '1'

export type ContractReq = {
  body?: ZodType
  query?: ZodType // make sure Tpath if as /path/:id then params must have zodtype infer key of id
  params?: ZodObject
}

export type Path = `/${string}`

export type ContractRouteDef = {
  method: Methods
  path: Path
  contentType: 'multipart/form-data' | 'application/json'
  request?: ContractReq
  response?: Class
}

export type RoutesDef = Record<string, ContractRouteDef>

export type Class<T = any> = new (...args: any[]) => T

export type ContractReqSchemaDef = Record<string, ContractReq>

export type ContractResDTODef = Record<string, Class>

export type ContractGroupDef = {
  version: Verions
  prefix: Path
  routes: RoutesDef
}
