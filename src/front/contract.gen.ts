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
    this.generatorConfig = _config
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
    return `type Mapping = {${this.renderControllers()}\r}`
  }

  private renderControllers() {
    let controllerStr = ""
    for (const controllerKey in this.mapping) {
      controllerStr += `${this.addLine(
        1
      )}${controllerKey}: {${this.renderServices(
        this.mapping[controllerKey]
      )}${this.addLine(1)}}`
    }
    return controllerStr
  }

  private renderServices(mapping: any) {
    const { _config, ...serviceMapping } = mapping
    let serviceStr = ""
    for (const serviceKey in serviceMapping) {
      serviceStr += `${this.addLine(2)}${serviceKey}: {${this.renderDtos(
        serviceMapping[serviceKey]
      )}${this.addLine(2)}}`
    }
    return serviceStr
  }

  private renderDtos(mapping: any) {
    const { _config, ...dtoMapping } = mapping
    let dtoStr = ""
    const keys = Object.keys(dtoMapping)
    let reqTypeStr = dtoMapping.req
    if (!reqTypeStr || !keys.includes("req")) {
      reqTypeStr = "any"
    }
    dtoStr += `${this.addLine(3)}req: ${reqTypeStr}`

    const resType = dtoMapping.res
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
