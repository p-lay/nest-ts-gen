export type MappingConfig = {
  promiseGenericRes: string
}

export type ModelConfig = {
  disableEntity: boolean
  disableController: boolean
}

export class BaseRender {
  mappingConfig: MappingConfig

  addLine(tabCount?: number) {
    let space = ""
    for (let index = 0; index < 2 * tabCount; index++) {
      space += " "
    }
    return `\r${space}`
  }

  upperFirstLetter(str: string) {
    const firstLetter = str.charAt(0)
    return str.replace(firstLetter, firstLetter.toUpperCase())
  }

  get commonResType() {
    return this.mappingConfig.promiseGenericRes
  }

  get globalTypeFileName() {
    return "global"
  }

  getRequestType(str: string) {
    if (!str) {
      return "any"
    } else {
      return str
    }
  }

  getControllerResponseType(str: string) {
    if (!str || str == "any" || str.toLowerCase() == "object") {
      return this.commonResType
    } else {
      return `${this.commonResType}<${str}>`
    }
  }

  getServiceResponseType(str: string) {
    if (!str || str == "any" || str.toLowerCase() == "object") {
      return "Promise<any>"
    } else {
      return `Promise<${str}>`
    }
  }
}
