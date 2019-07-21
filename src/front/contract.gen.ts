import * as fs from "fs"
import { BaseRender } from "../baseRender"
import { Model, Method } from "../type/global"

export type Config = {
  mappingFileName: string
  typeName: string
}

export type Param = {
  mapping: any
  outFolderPath: string
  config?: Partial<Config>
}

export class ContractGen extends BaseRender {
  constructor(param: Param) {
    super()
    const { mapping, mappingConfig } = this.getMappingInfo(param.mapping)
    this.mapping = mapping
    this.mappingConfig = mappingConfig
    this.outFolder = param.outFolderPath
    const paramConfig = param.config || {}
    this.config = { ...this.defaultConfig, ...paramConfig }
  }
  mapping: any
  outFolder: string
  defaultConfig: Partial<Config> = {
    mappingFileName: "mapping.d.ts",
    typeName: "ContractType"
  }
  config: Partial<Config>

  private renderMappingType() {
    return `type Mapping = {${this.renderModels()}\r}`
  }

  private renderModels() {
    let modelStr = ""
    for (const modelKey in this.mapping) {
      const { model, modelConfig } = this.getModelInfo(this.mapping[modelKey])
      if (modelConfig.disableController) continue

      modelStr += `${this.addLine(1)}${modelKey}: {${this.renderMethods(
        model
      )}${this.addLine(1)}}`
    }
    return modelStr
  }

  private renderMethods(model: Model) {
    let methodStr = ""
    for (const methodKey in model) {
      const { method } = this.getMethodInfo(model[methodKey])
      methodStr += `${this.addLine(2)}${methodKey}: {${this.renderMethod(
        method
      )}${this.addLine(2)}}`
    }
    return methodStr
  }

  private renderMethod(method: Method) {
    let dtoStr = ""
    const keys = Object.keys(method)
    let reqTypeStr = method.req
    if (!reqTypeStr || !keys.includes("req")) {
      reqTypeStr = "any"
    }
    dtoStr += `${this.addLine(3)}req: ${reqTypeStr}`

    const resType = method.res
    let resTypeStr = resType
    if (!resTypeStr || !keys.includes("res")) {
      resTypeStr = "any"
    } else {
      resTypeStr = `${resTypeStr}`
    }
    dtoStr += `${this.addLine(3)}res: ${resTypeStr}`

    return dtoStr
  }

  private renderContractType() {
    const controllers = Object.keys(this.mapping)
      .filter(modelKey => {
        const { modelConfig } = this.getModelInfo(this.mapping[modelKey])
        return !modelConfig.disableController
      })
      .map(controller => `Mapping['${controller}']`)
    return `type ${this.config.typeName} = ${controllers.join(" & ")}`
  }

  public generate() {
    const mappingType = this.renderMappingType()
    const contractType = this.renderContractType()
    fs.writeFileSync(
      this.outFolder + "/" + this.config.mappingFileName,
      mappingType + "\r" + contractType
    )
  }
}
