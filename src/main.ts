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
    contractFolderName,
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
      contractFolderName,
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
  const {
    mapping,
    rootFolderPath,
    typeFolderName,
    sourceContractFolderPath
  } = param
  new ContractGen({
    mapping,
    outFolder: join(rootFolderPath, typeFolderName)
  }).generate()

  new DefinitionGen(
    sourceContractFolderPath,
    join(rootFolderPath, typeFolderName)
  ).generate()
}
