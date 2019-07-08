export type CommonRes<T = any> = Promise<{
  // default 0
  code?: Code
  message?: string
  data: T
}>

export type Code = 1000 | 2000
