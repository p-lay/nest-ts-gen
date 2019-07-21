import * as fs from "fs"
import { BaseRender } from "../baseRender"
import { Method, ModelConfig } from "../type/global"

type Param = {
  model: any
  modelKey: string
  mappingConfig: any
  modelConfig: ModelConfig
}

type Config = {
  serviceFolderName: string
  sourceContractFolderRelativePath: string
  sourceEntityFolderRelativePath: string
  outFolder: string
}

export class ServiceGen extends BaseRender {
  constructor(param: Param, config: Config) {
    super()
    this.modelKey = param.modelKey
    this.model = param.model
    this.modelConfig = param.modelConfig
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

  replaceMethodHeader(str: string, methodKey: string, method: Method) {
    // async method\(([\n\s]+)?param: \w+([,\n\s]+)?\): Promise<\w+> {
    const regExp = new RegExp(
      `async ${methodKey}\\(([\\n\\s]+)?${
        this.mappingConfig.paramName
      }: \\w+([,\\n\\s]+)?\\): Promise<\\w+> {`
    )
    const targetMethodHeader = `async ${methodKey}(${
      this.mappingConfig.paramName
    }: ${this.getRequestType(method.req)}): ${this.getServiceResponseType(
      method.res
    )} {`

    return str.replace(regExp, targetMethodHeader)
  }

  replaceImports(str: string) {
    const regExp = new RegExp(
      `import {[\\w\\s,]+} from ['"]${
        this.config.sourceContractFolderRelativePath
      }/${this.modelKey}['"]`
    )
    const targetImports = `import { ${this.allDtoTypes.join(", ")} } from '${
      this.config.sourceContractFolderRelativePath
    }/${this.modelKey}'`

    return str.replace(regExp, targetImports)
  }

  renderEntityImports() {
    if (this.modelConfig.disableEntity) {
      return ""
    } else {
      return `\nimport { InjectRepository } from '@nestjs/typeorm'\nimport { Repository } from 'typeorm'\nimport { ${
        this.entityName
      } } from '${this.config.sourceEntityFolderRelativePath}/${
        this.modelKey
      }.entity'`
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
    return `${this.addLine(1)}async ${methodKey}(${
      this.mappingConfig.paramName
    }: ${this.getRequestType(method.req)}): ${this.getServiceResponseType(
      method.res
    )} {${this.addLine(2)}return null${this.addLine(1)}}`
  }

  renderClassDecorator() {
    return `@Injectable()`
  }

  render() {
    return `${this.renderImports()}\n\n${this.renderClass()}`
  }

  replace(str: string) {
    let targetStr = this.replaceImports(str)
    for (const methodKey in this.model) {
      const methodInfo = this.getMethodInfo(this.model[methodKey])
      targetStr = this.replaceMethodHeader(
        targetStr,
        methodKey,
        methodInfo.method
      )
    }
    return targetStr
  }

  public generate() {
    const outputFile = `${this.config.outFolder}/${this.modelKey}.service.ts`
    if (fs.existsSync(outputFile)) {
      const str = fs.readFileSync(outputFile).toString()
      const result = this.replace(str)
      fs.writeFileSync(outputFile, result)
    } else {
      const str = this.render()
      fs.writeFileSync(outputFile, str)
    }
  }
}
