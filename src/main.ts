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
    serviceFolderName,
    sourceContractFolderRelativePath,
    rootFolderPath,
    controllerFolderName,
    entityFolderName,
    moduleFolderName
  } = param
  new ControllerGen(
    {
      mapping
    },
    {
      serviceFolderName,
      sourceContractFolderRelativePath,
      controllerOutFolder: join(rootFolderPath, controllerFolderName),
      // for serviceGen
      serviceOutFolder: join(rootFolderPath, serviceFolderName),
      entityFolderName
    }
  ).generate()

  new ModuleGen(
    { mapping },
    {
      controllerFolderName,
      serviceFolderName,
      entityFolderName,
      outFolder: join(rootFolderPath, moduleFolderName)
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
