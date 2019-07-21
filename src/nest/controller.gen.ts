import * as fs from "fs"
import { BaseRender } from "../baseRender"
import { Method } from "../type/global"
import { ServiceGen } from "./service.gen"

export type Param = {
  mapping: any
}

export type Config = {
  serviceFolderName: string
  sourceContractFolderRelativePath: string
  controllerOutFolder: string
  // for serviceGen
  serviceOutFolder: string
  sourceEntityFolderRelativePath: string
}

export class ControllerGen extends BaseRender {
  constructor(param: Param, config: Config) {
    super()
    const { mapping, mappingConfig } = this.getMappingInfo(param.mapping)
    this.mapping = mapping
    this.mappingConfig = mappingConfig
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
    }.service'\nimport { ${this.commonResType} } from '${
      this.config.sourceContractFolderRelativePath
    }/${this.globalTypeFileName}'\nimport { ${this.allDtoTypes.join(
      ", "
    )} } from '${this.config.sourceContractFolderRelativePath}/${this.modelKey}'`
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
    const { model } = this.getModelInfo(this.mapping[this.modelKey])
    for (const methodKey in model) {
      methodStr += this.renderMethod(methodKey, model[methodKey]) + "\r"
    }
    return methodStr
  }

  renderMethod(key: string, method: Method) {
    return `${this.addLine(1)}@Post('${key}')${this.addLine(
      1
    )}async ${key}(@Body() ${this.mappingConfig.paramName}: ${this.getRequestType(
      method.req
    )}): ${this.getControllerResponseType(method.res)} {${this.addLine(
      2
    )}const data = await this.service.${key}(${this.mappingConfig.paramName})${this.addLine(
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
      const { model, modelConfig } = this.getModelInfo(this.mapping[modelKey])
      if (!modelConfig.disableController) {
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
          modelConfig,
          mappingConfig: this.mappingConfig
        },
        {
          serviceFolderName: this.config.serviceFolderName,
          sourceContractFolderRelativePath: this.config.sourceContractFolderRelativePath,
          outFolder: this.config.serviceOutFolder,
          sourceEntityFolderRelativePath: this.config.sourceEntityFolderRelativePath
        }
      ).generate()
    }
  }
}
