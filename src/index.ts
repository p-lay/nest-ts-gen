import { join } from "path"
import { NestParam } from "./type/genParam"
import { FrontParam } from "./type/genParam"
import { ControllerGen } from "./nest/controller.gen"
import { ModuleGen } from "./nest/module.gen"
import { ContractGen } from "./front/contract.gen"
import { DefinitionGen } from "./front/definition.gen"

export function generateNest(param: NestParam) {
  const {
    mapping,
    sourceContractFolderRelativePath,
    sourceEntityFolderRelativePath,
    outFolderInfo: { rootPath, controllerFolder, serviceFolder, moduleFolder }
  } = param
  new ControllerGen(
    {
      mapping
    },
    {
      serviceFolderName: serviceFolder,
      sourceContractFolderRelativePath,
      controllerOutFolder: join(rootPath, controllerFolder),
      // for serviceGen
      serviceOutFolder: join(rootPath, serviceFolder),
      sourceEntityFolderRelativePath
    }
  ).generate()

  new ModuleGen(
    { mapping },
    {
      controllerFolderName: controllerFolder,
      serviceFolderName: serviceFolder,
      sourceEntityFolderRelativePath,
      outFolder: join(rootPath, moduleFolder)
    }
  ).generate()
}

export function generateFront(param: FrontParam) {
  const { mapping, outFolderPath, sourceContractFolderPath } = param
  new ContractGen({
    mapping,
    outFolderPath
  }).generate()

  new DefinitionGen(sourceContractFolderPath, outFolderPath).generate()
}
