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
    this.mapping = param.mapping
    this.outFolder = param.outFolder
    const paramConfig = param.config || {}
    this.config = { ...this.defaultConfig, ...paramConfig }
    this.defaultType =
      (this.mapping._config && this.mapping._config.defaultType) || `{}`
  }
  mapping: any
  outFolder: string
  defaultConfig: Partial<Config> = {
    outFileName: "mapping.d.ts",
    typeName: "ContractType"
  }
  config: Partial<Config>
  defaultType: string

  private renderMappingType() {
    return `type Mapping = {${this.renderControllers()}\r}`
  }

  private renderControllers() {
    let controllerStr = ""
    for (const controller of Object.keys(this.mapping)) {
      if (this.isInnerKey(controller)) continue

      controllerStr += `${this.addLine(1)}${controller}: {${this.renderServices(
        this.mapping[controller]
      )}${this.addLine(1)}}`
    }
    return controllerStr
  }

  private renderServices(services: any) {
    let serviceStr = ""
    for (const service of Object.keys(services)) {
      if (this.isInnerKey(service)) continue

      serviceStr += `${this.addLine(2)}${service}: {${this.renderDtos(
        services[service]
      )}${this.addLine(2)}}`
    }
    return serviceStr
  }

  private renderDtos(dtos: any) {
    let dtoStr = ""
    for (const dto of Object.keys(dtos)) {
      if (this.isInnerKey(dto)) continue

      let dtoValue = dtos[dto]
      if (!dtoValue) {
        dtoValue = this.defaultType
      }
      dtoStr += `${this.addLine(3)}${dto}: ${dtoValue}`
    }
    return dtoStr
  }

  private renderContractType() {
    const controllers = Object.keys(this.mapping)
      .filter(x => !this.isInnerKey(x))
      .map(controller => `Mapping['${controller}']`)
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
