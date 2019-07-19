import * as fs from "fs"
import { BaseRender } from "../baseRender"

type Config = {
  outFileName: string
  typeName: string
}

type Param = {
  mapping: any
  outFolder: string
  config?: Partial<Config>
}

export class ContractGen extends BaseRender {
  constructor(param: Param) {
    super()
    const { _config, ...mapping } = param.mapping
    this.mapping = mapping
    this.mappingConfig = _config
    this.outFolder = param.outFolder
    const paramConfig = param.config || {}
    this.config = { ...this.defaultConfig, ...paramConfig }
  }
  mapping: any
  outFolder: string
  defaultConfig: Partial<Config> = {
    outFileName: "mapping.d.ts",
    typeName: "ContractType"
  }
  config: Partial<Config>

  private renderMappingType() {
    return `type Mapping = {${this.renderModels()}\r}`
  }

  private renderModels() {
    let modelStr = ""
    for (const modelKey in this.mapping) {
      modelStr += `${this.addLine(
        1
      )}${modelKey}: {${this.renderMethods(
        this.mapping[modelKey]
      )}${this.addLine(1)}}`
    }
    return modelStr
  }

  private renderMethods(mapping: any) {
    const { _config, ...model } = mapping
    let methodStr = ""
    for (const methodKey in model) {
      methodStr += `${this.addLine(2)}${methodKey}: {${this.renderMethod(
        model[methodKey]
      )}${this.addLine(2)}}`
    }
    return methodStr
  }

  private renderMethod(mapping: any) {
    const { _config, ...method } = mapping
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
    const controllers = Object.keys(this.mapping).map(
      controller => `Mapping['${controller}']`
    )
    return `type ${this.config.typeName} = ${controllers.join(" & ")}`
  }

  public generate() {
    const mappingType = this.renderMappingType()
    const contractType = this.renderContractType()
    fs.writeFileSync(
      this.outFolder + "/" + this.config.outFileName,
      mappingType + "\r" + contractType
    )
  }
}
