import * as fs from "fs"
import { BaseRender } from "../baseRender"
import { Method, Model } from "../type/global"

type Param = {
  mapping: any
}

type Config = {
  outFolder: string
  controllerFolderName: string
  serviceFolderName: string
  entityFolderName: string
}

type ServiceConfig = {
  disableEntity: boolean
}

export class ModuleGen extends BaseRender {
  constructor(param: Param, config: Config) {
    super()
    const { mapping, mappingConfig } = this.getMappingInfo(param.mapping)
    this.mapping = mapping
    this.mappingConfig = mappingConfig
    this.config = config
  }
  mapping: any
  config: Config

  getPrefixKey(key: string) {
    return this.upperFirstLetter(key)
  }
  getControllerName(key: string) {
    return `${this.getPrefixKey(key)}Controller`
  }
  getServiceName(key: string) {
    return `${this.getPrefixKey(key)}Service`
  }
  getEntityName(key: string) {
    return `${this.getPrefixKey(key)}Entity`
  }

  getServiceContractTypes(service: Method) {
    function getType(str: string) {
      if (str && str.toLowerCase() != "any" && str.toLowerCase() != "object") {
        return str
      }
    }

    const reqType = getType(service.req)
    const resType = getType(service.res)
    return [reqType, resType].filter(x => !!x)
  }

  //   renderEntityImports() {
  //     if (this.serviceConfig.disableEntity) {
  //       return ""
  //     } else {
  //       return `\nimport { InjectRepository } from '@nestjs/typeorm'\nimport { Repository } from 'typeorm'\nimport { ${
  //         this.entityName
  //       } } from '../${this.config.entityFolderName}/${this.key}.entity'`
  //     }
  //   }

  //   import { AppController } from '../controller/app.controller'
  // import { VueController } from '../controller/vue.controller'
  // import { QiniuController } from '../controller/qiniu.controller'
  // import { UserController } from '../controller/user.controller'

  // export const controllers = [
  //   AppController,
  //   VueController,
  //   QiniuController,
  //   UserController,
  // ]

  renderModuleController() {
    const controllerNames = []
    let str = ""
    for (const modelKey in this.mapping) {
      const { model, modelConfig } = this.getModelInfo(this.mapping[modelKey])
      if (!modelConfig.disableController) {
        const controllerName = this.getControllerName(modelKey)
        controllerNames.push(controllerName)
        str += `import { ${controllerName} } from '../${
          this.config.controllerFolderName
        }/${modelKey}.controller'\n`
      }
    }

    str += `\nexport const controllers = [${this.addLine(
      1
    )}${controllerNames.join(", ")}\n]`

    return str
  }

  public generate() {
    const controllerStr = this.renderModuleController()
    fs.writeFileSync(`${this.config.outFolder}/controllers.ts`, controllerStr)
  }
}
