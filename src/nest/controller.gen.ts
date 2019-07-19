import * as fs from "fs"
import { BaseRender } from "../baseRender"
import { Method } from "../type/global"
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
    const { _config, ...mapping } = param.mapping
    this.mapping = mapping
    this.mappingConfig = _config || {}
    this.config = config
  }
  modelKey: string
  mapping: any
  config: Config

  get prefixKey() {
    return this.upperFirstLetter(this.modelKey)
  }
  get className() {
    return `${this.prefixKey}Controller`
  }
  get serviceName() {
    return `${this.prefixKey}Service`
  }
  get allDtoTypes(): string[] {
    const result = []
    const model = this.mapping[this.modelKey]
    for (const key in model) {
      const method: Method = model[key]
      const types = this.getDtoTypes(method)
      result.push(...types)
    }
    return result
  }

  getDtoTypes(method: Method) {
    function getType(str: string) {
      if (str && str.toLowerCase() != "any" && str.toLowerCase() != "object") {
        return str
      }
    }

    const reqType = getType(method.req)
    const resType = getType(method.res)
    return [reqType, resType].filter(x => !!x)
  }

  renderImports() {
    return `import { Controller, Get, Post, Body, Req, Res } from '@nestjs/common'\nimport { ${
      this.serviceName
    } } from '../${this.config.serviceFolderName}/${
      this.modelKey
    }.service'\nimport { ${this.commonResType} } from '../${
      this.config.contractFolderName
    }/${this.globalTypeFileName}'\nimport { ${this.allDtoTypes.join(
      ", "
    )} } from '../${this.config.contractFolderName}/${this.modelKey}'`
  }

  renderClass() {
    const decorator = this.renderClassDecorator()
    return `${decorator}\nexport class ${this.className} {${this.addLine(
      1
    )}constructor(private readonly service: ${
      this.serviceName
    }) {}${this.addLine(1)}${this.renderMethods()}\n}`
  }

  renderMethods() {
    let methodStr = ""
    const { _config, ...model } = this.mapping[this.modelKey]
    for (const methodKey in model) {
      methodStr +=
        this.renderMethod(methodKey, model[methodKey]) + "\r"
    }
    return methodStr
  }

  renderMethod(key: string, method: Method) {
    return `${this.addLine(1)}@Post('${key}')${this.addLine(
      1
    )}async ${key}(@Body() param: ${this.getRequestType(
      method.req
    )}): ${this.getControllerResponseType(method.res)} {${this.addLine(
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
    for (const modelKey in this.mapping) {
      const model = this.mapping[modelKey]
      const disableController = model._config && model._config.disableController
      if (!disableController) {
        this.modelKey = modelKey
        const str = this.render()
        fs.writeFileSync(
          `${this.config.controllerOutFolder}/${modelKey}.controller.ts`,
          str
        )
      }

      new ServiceGen(
        {
          modelKey,
          model,
          mappingConfig: this.mappingConfig
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
