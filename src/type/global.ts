export interface MappingConfig {
  promiseGenericRes: string
}

export interface ModelConfig {
  disableEntity: boolean
  disableController: boolean
}

export interface MethodConfig {}

export interface Model {
  [key: string]: Method
}

export interface Method {
  req: string
  res: string
}
