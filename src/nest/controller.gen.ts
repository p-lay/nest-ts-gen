import * as fs from "fs"
import { BaseRender } from "../baseRender"
import { Service } from "../type/global"
import { ServiceGen } from "./service.gen"

type Param = {
  mapping: any
}

type Config = {
  serviceFolderName: string
  contractFolderName: string
  controllerOutFolder: string
  // for serviceGen
  serviceOutFolder: string
  entityFolderName: string
}

export class ControllerGen extends BaseRender {
  constructor(param: Param, config: Config) {
    super()
    const { _config, ...controllerMapping } = param.mapping
    this.mapping = controllerMapping
    this.generatorConfig = _config || {}
    this.config = config
  }
  key: string
  mapping: any
  config: Config

  get prefixKey() {
    return this.upperFirstLetter(this.key)
  }
  get className() {
    return `${this.prefixKey}Controller`
  }
  get serviceName() {
    return `${this.prefixKey}Service`
  }
  get allContractTypes(): string[] {
    const result = []
    const services = this.mapping[this.key]
    for (const key in services) {
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
    } } from '../${this.config.serviceFolderName}/${
      this.key
    }.service'\nimport { ${this.commonResType} } from '../${
      this.config.contractFolderName
    }/${this.globalTypeFileName}'\nimport { ${this.allContractTypes.join(
      ", "
    )} } from '../${this.config.contractFolderName}/${this.key}'`
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
    const { _config, ...serviceMapping } = this.mapping[this.key]
    for (const serviceKey in serviceMapping) {
      serviceStr +=
        this.renderService(serviceKey, serviceMapping[serviceKey]) + "\r"
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
      this.key = key
      const str = this.render()
      fs.writeFileSync(
        `${this.config.controllerOutFolder}/${key}.controller.ts`,
        str
      )

      new ServiceGen(
        {
          key,
          mapping: this.mapping[key],
          generatorConfig: this.generatorConfig
        },
        {
          serviceFolderName: this.config.serviceFolderName,
          contractFolderName: this.config.contractFolderName,
          outFolder: this.config.serviceOutFolder,
          entityFolderName: this.config.entityFolderName
        }
      ).generate()
    }
  }
}
