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
  sourceEntityFolderRelativePath: string
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

  renderModuleService() {
    const serviceNames = []
    let str = ""
    for (const modelKey in this.mapping) {
      const { model, modelConfig } = this.getModelInfo(this.mapping[modelKey])
      const serviceName = this.getServiceName(modelKey)
      serviceNames.push(serviceName)
      str += `import { ${serviceName} } from '../${
        this.config.serviceFolderName
      }/${modelKey}.service'\n`
    }

    str += `\nexport const services = [${this.addLine(1)}${serviceNames.join(
      ", "
    )}\n]`

    return str
  }

  renderModuleEntity() {
    const entityNames = []
    let str = ""
    for (const modelKey in this.mapping) {
      const { model, modelConfig } = this.getModelInfo(this.mapping[modelKey])
      if (!modelConfig.disableEntity) {
        const entityName = this.getEntityName(modelKey)
        entityNames.push(entityName)
        str += `import { ${entityName} } from '${
          this.config.sourceEntityFolderRelativePath
        }/${modelKey}.entity'\n`
      }
    }

    str += `\nexport const entities = [${this.addLine(1)}${entityNames.join(
      ", "
    )}\n]`

    return str
  }

  public generate() {
    const controllerStr = this.renderModuleController()
    fs.writeFileSync(`${this.config.outFolder}/controllers.ts`, controllerStr)

    const serviceStr = this.renderModuleService()
    fs.writeFileSync(`${this.config.outFolder}/services.ts`, serviceStr)

    const entityStr = this.renderModuleEntity()
    fs.writeFileSync(`${this.config.outFolder}/entities.ts`, entityStr)
  }
}
