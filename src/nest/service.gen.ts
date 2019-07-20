import * as fs from "fs"
import { BaseRender } from "../baseRender"
import { Method, ModelConfig } from "../type/global"

type Param = {
  model: any
  modelKey: string
  mappingConfig: any
}

type Config = {
  serviceFolderName: string
  sourceContractFolderRelativePath: string
  entityFolderName: string
  outFolder: string
}

export class ServiceGen extends BaseRender {
  constructor(param: Param, config: Config) {
    super()
    const { model, modelConfig } = this.getModelInfo(param.model)
    this.modelKey = param.modelKey
    this.model = model
    this.modelConfig = modelConfig
    this.mappingConfig = param.mappingConfig
    this.config = config
  }
  modelKey: string
  model: any
  modelConfig: ModelConfig
  config: Config

  get prefixKey() {
    return this.upperFirstLetter(this.modelKey)
  }
  get className() {
    return `${this.prefixKey}Service`
  }
  get entityName() {
    return `${this.prefixKey}Entity`
  }
  get allDtoTypes(): string[] {
    const result = []
    for (const methodKey in this.model) {
      const method: Method = this.model[methodKey]
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

  renderEntityImports() {
    if (this.modelConfig.disableEntity) {
      return ""
    } else {
      return `\nimport { InjectRepository } from '@nestjs/typeorm'\nimport { Repository } from 'typeorm'\nimport { ${
        this.entityName
      } } from '../${this.config.entityFolderName}/${this.modelKey}.entity'`
    }
  }

  renderImports() {
    return `import { Injectable, Inject } from '@nestjs/common'\nimport { ${this.allDtoTypes.join(
      ", "
    )} } from '${this.config.sourceContractFolderRelativePath}/${
      this.modelKey
    }'${this.renderEntityImports()}`
  }

  renderConstructor() {
    if (this.modelConfig.disableEntity) {
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
    )}${this.renderConstructor()}\n${this.renderMethods()}\n}`
  }

  renderMethods() {
    let methodStr = ""
    for (const methodKey in this.model) {
      methodStr += this.renderMethod(methodKey, this.model[methodKey]) + "\r"
    }
    return methodStr
  }

  renderMethod(methodKey: string, method: Method) {
    return `${this.addLine(1)}async ${methodKey}(param: ${this.getRequestType(
      method.req
    )}): ${this.getServiceResponseType(method.res)} {${this.addLine(
      2
    )}return null${this.addLine(1)}}`
  }

  renderClassDecorator() {
    return `@Injectable()`
  }

  render() {
    return `${this.renderImports()}\n\n${this.renderClass()}`
  }

  public generate() {
    const str = this.render()
    fs.writeFileSync(
      `${this.config.outFolder}/${this.modelKey}.service.ts`,
      str
    )
  }
}
