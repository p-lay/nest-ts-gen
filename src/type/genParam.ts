export interface NestParam {
  mapping: any
  sourceContractFolderRelativePath: string
  sourceEntityFolderRelativePath: string
  outFolderInfo: {
    rootPath: string
    controllerFolder: string
    serviceFolder: string
    moduleFolder: string
  }
}

export interface FrontParam {
  mapping: any
  outFolderPath: string
  sourceContractFolderPath: string
}
