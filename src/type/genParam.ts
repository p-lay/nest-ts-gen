export interface NestParam {
  mapping: any
  rootFolderPath: string
  serviceFolderName: string
  // the path related to output file path
  sourceContractFolderRelativePath: string
  controllerFolderName: string
  entityFolderName: string
  moduleFolderName: string
}

export interface FrontParam {
  mapping: any
  outFolderPath: string
  sourceContractFolderPath: string
}
