import type { ContractGroupDef } from 'common'

export const validContract = <C extends ContractGroupDef>(contract: C) => {
  const { routes } = contract
  for (const routeKey in routes) {
    const route = routes[routeKey]
    if (!route) continue
    const { path } = route
    const paramsInPath =
      path.match(/:([^/]+)/g)?.map((param) => param.slice(1)) || []
    const paramsInReq = route.request?.params
    if (paramsInReq) {
      const keysInReq = Object.keys(paramsInReq.shape)
      const missingInReq = paramsInPath.filter(
        (param) => !keysInReq.includes(param),
      )
      const extraInReq = keysInReq.filter((key) => !paramsInPath.includes(key))

      if (missingInReq.length > 0 || extraInReq.length > 0) {
        throw new Error(
          `Route ${routeKey} has mismatched params. Missing in request: ${missingInReq.join(
            ', ',
          )}. Extra in request: ${extraInReq.join(', ')}.`,
        )
      }
    } else if (paramsInPath.length > 0) {
      throw new Error(
        `Route ${routeKey} has path params but no params defined in request. Missing: ${paramsInPath.join(
          ', ',
        )}.`,
      )
    }
  }
  return contract
}
