import * as fs from "fs"
import { BaseRender } from "../baseRender"
import { Service } from "../type/global"

type Param = {
  mapping: any
  serviceFolderName: string
  contractFolderName: string
  outFolder: string
}

export class ServiceGen extends BaseRender {
  constructor(param: Param) {
    super()
    this.mapping = param.mapping
    this.serviceFolderName = param.serviceFolderName
    this.contractFolderName = param.contractFolderName
    this.outFolder = param.outFolder
  }
  key: string
  mapping: any
  serviceFolderName: string
  contractFolderName: string
  outFolder: string

  get controllerPrefix() {
    return this.upperFirstLetter(this.key)
  }
  get className() {
    return `${this.controllerPrefix}Controller`
  }
  get serviceName() {
    return `${this.controllerPrefix}Service`
  }
  get allContractTypes(): string[] {
    const result = []
    const services = this.mapping[this.key]
    for (const key in services) {
      if (this.isInnerKey(key)) continue

      const service: Service = services[key]
      const types = this.getServiceContractTypes(service)
      result.push(...types)
    }
    return result
  }

  getServiceContractTypes(service: Service) {
    function getType(str: string) {
      if (str && str.toLowerCase() != "any" && str.toLowerCase() != "object") {
        return str
      }
    }

    const reqType = getType(service.req)
    const resType = getType(service.res)
    return [reqType, resType].filter(x => !!x)
  }

  renderImports() {
    return `import { Controller, Get, Post, Body, Req, Res } from '@nestjs/common'\nimport { ${
      this.serviceName
    } } from '../${this.serviceFolderName}/${this.key}.service'\nimport { ${
      this.commonResType
    } } from '../${this.contractFolderName}/${
      this.globalTypeFileName
    }'\nimport { ${this.allContractTypes.join(", ")} } from '../${
      this.contractFolderName
    }/${this.key}'`
  }

  renderClass() {
    const decorator = this.renderClassDecorator()
    return `${decorator}\nexport class ${this.className} {${this.addLine(
      1
    )}constructor(private readonly service: ${
      this.serviceName
    }) {}${this.addLine(1)}${this.renderServices()}\n}`
  }

  renderServices() {
    let serviceStr = ""
    const services = this.mapping[this.key]
    for (const key in services) {
      if (this.isInnerKey(key)) continue

      serviceStr += this.renderService(key, services[key]) + "\r"
    }
    return serviceStr
  }

  renderService(key: string, service: Service) {
    return `${this.addLine(1)}@Post('${key}')${this.addLine(
      1
    )}async ${key}(@Body() param: ${this.getRequestType(
      service.req
    )}): ${this.getResponseType(service.res)} {${this.addLine(
      2
    )}const data = await this.service.${key}(param)${this.addLine(
      2
    )}return {${this.addLine(3)}data,${this.addLine(2)}}${this.addLine(1)}}`
  }

  renderClassDecorator() {
    return `@Controller()`
  }

  render() {
    return `${this.renderImports()}\n\n${this.renderClass()}`
  }

  public generate() {
    for (const key in this.mapping) {
      if (this.isInnerKey(key)) continue

      this.key = key
      const str = this.render()
      fs.writeFileSync(`${this.outFolder}/${key}.controller.ts`, str + "\n")
    }
  }
}
