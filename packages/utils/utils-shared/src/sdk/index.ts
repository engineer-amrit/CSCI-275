import type { ContractGroupDef } from 'common'
import { type AxiosInstance } from 'axios'
import type { SDKMethods } from './sdk.types.js'
export * from './sdk.types.js'
import { type AnyObject, flattenToQuery, formDataMaker } from '../form-utils.js'

export class SDK<T extends ContractGroupDef> {
  private base: string
  constructor(
    private readonly contract: T,
    private readonly http: AxiosInstance,
  ) {
    this.base = `/v${contract.version}${contract.prefix}`
  }

  private getFullPath(
    path: string,
    query?: AnyObject,
    params?: Record<string, string>,
  ) {
    const queryString = query
      ? '?' + new URLSearchParams(flattenToQuery(query))
      : ''

    const parsedPath = path.replace(/:([^/]+)/g, (_, key: string) => {
      const value = params?.[key]

      if (!value) {
        throw new Error(`Missing route param: ${key}`)
      }

      return value
    })

    if (parsedPath === '/') {
      return this.base + queryString
    }

    return `${this.base}${parsedPath}${queryString}`
  }

  create() {
    const { routes } = this.contract
    const sdk = {} as Record<keyof T['routes'], unknown>

    for (const key in routes) {
      const value = routes[key]
      if (!value) continue
      sdk[key as keyof SDKMethods<T>] = async (req?: {
        body?: AnyObject
        query?: AnyObject
        params?: Record<string, string>
      }) => {
        let contentType
        if (value.method !== 'GET') {
          contentType = value.contentType
        }

        const res = await this.http.request({
          method: value.method,
          url: this.getFullPath(value.path, req?.query, req?.params),
          data:
            value.contentType === 'multipart/form-data'
              ? formDataMaker(req?.body || {})
              : req?.body,
          headers: {
            'Content-Type': contentType,
          },
        })
        return res.data
      }
    }
    return sdk as SDKMethods<T>
  }
}
