import * as fs from "fs"
import { BaseRender } from "../baseRender"
import { Service } from "../type/global"

type Param = {
  serviceMapping: any
  key: string
  serviceConfig: any
  generatorConfig: any
}

type Config = {
  serviceFolderName: string
  contractFolderName: string
  entityFolderName: string
  outFolder: string
}

type ServiceConfig = {
  disableEntity: boolean
}

export class ServiceGen extends BaseRender {
  constructor(param: Param, config: Config) {
    super()
    this.key = param.key
    this.serviceMapping = param.serviceMapping
    this.serviceConfig = param.serviceConfig
    this.generatorConfig = param.generatorConfig
    this.config = config
  }
  key: string
  serviceMapping: any
  serviceConfig: ServiceConfig
  config: Config

  get prefixKey() {
    return this.upperFirstLetter(this.key)
  }
  get className() {
    return `${this.prefixKey}Service`
  }
  get entityName() {
    return `${this.prefixKey}Entity`
  }
  get allContractTypes(): string[] {
    const result = []
    const services = this.serviceMapping[this.key]
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

  //   import { Injectable, Inject } from '@nestjs/common'
  // import { InjectRepository } from '@nestjs/typeorm'
  // import { Repository } from 'typeorm'
  // import { VueEntity } from '../entity/vue.entity'
  // import { ResourceService } from './resource.service'
  // import { AddVueReq, UpdateVueReq, GetVueReq, GetVueRes } from '../contract/vue'

  renderEntityImports() {
    if (this.serviceConfig.disableEntity) {
      return ""
    } else {
      return `\nimport { Repository } from 'typeorm'\nimport { ${
        this.entityName
      } } from '../${this.config.entityFolderName}/${this.key}.entity'`
    }
  }

  renderImports() {
    return `import { Injectable, Inject } from '@nestjs/common'\nimport { InjectRepository } from '@nestjs/typeorm'\nimport { ${
      this.commonResType
    } } from '../${this.config.contractFolderName}/${
      this.globalTypeFileName
    }'\nimport { ${this.allContractTypes.join(", ")} } from '../${
      this.config.contractFolderName
    }/${this.key}'${this.renderEntityImports()}`
  }

  // @Injectable()
  // export class VueService {
  // constructor(
  //   @InjectRepository(VueEntity)
  //   readonly vueRepo: Repository<VueEntity>,
  //   @Inject(ResourceService)
  //   private readonly resourceService: ResourceService,
  // ) {}

  // async addVue(param: AddVueReq) {
  // }

  renderConstructor() {
    if (this.serviceConfig.disableEntity) {
      return `constructor() {}`
    } else {
      return `constructor(${this.addLine(2)}@InjectRepository(${
        this.entityName
      })${this.addLine(2)}readonly repo: Repository<${
        this.entityName
      }>,${this.addLine(1)}) {}`
    }
  }

  renderClass() {
    const decorator = this.renderClassDecorator()
    return `${decorator}\nexport class ${this.className} {${this.addLine(
      1
    )}${this.renderConstructor()}\n${this.renderServices()}\n}`
  }

  renderServices() {
    let serviceStr = ""
    for (const serviceKey in this.serviceMapping) {
      serviceStr +=
        this.renderService(serviceKey, this.serviceMapping[serviceKey]) + "\r"
    }
    return serviceStr
  }

  renderService(serviceKey: string, service: Service) {
    return `${this.addLine(1)}async ${serviceKey}(param: ${this.getRequestType(
      service.req
    )}): Promise<${this.getServiceResponseType(service.res)}> {${this.addLine(1)}}`
  }

  renderClassDecorator() {
    return `@Injectable()`
  }

  render() {
    return `${this.renderImports()}\n\n${this.renderClass()}`
  }

  public generate() {
    const str = this.render()
    fs.writeFileSync(`${this.config.outFolder}/${this.key}.service.ts`, str)
  }
}
