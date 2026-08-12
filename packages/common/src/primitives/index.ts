export interface ErrorsDTO {
  path: PropertyKey[]
  message: string
}
export type ErrorDTO = {
  message: string
  errors?: ErrorsDTO[]
}

export type PaginationDTO = {
  page: number
  total: number
  nextPage: number | null
}
