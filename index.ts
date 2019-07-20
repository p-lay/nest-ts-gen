import mapping from "./contract/_mapping"
import { join } from "path"
import { ContractGen } from "./src/front/contract.gen"
import { DefinitionGen } from "./src/front/definition.gen"
import { ControllerGen } from "./src/nest/controller.gen"
import { ModuleGen } from "./src/nest/module.gen"

const rootFolderPath = __dirname
// front-end
const contractFolderName = "contract"
const typeFolderName = "type"
// back-end
const controllerFolderName = "controller"
const serviceFolderName = "service"
const entityFolderName = "entity"
const moduleFolderName = "module"

// new ContractGen({
//   mapping,
//   outFolder: join(rootFolderPath, typeFolderName)
// }).generate()

// new DefinitionGen(
//   join(rootFolderPath, contractFolderName),
//   join(rootFolderPath, typeFolderName)
// ).generate()

// new ControllerGen(
//   {
//     mapping
//   },
//   {
//     serviceFolderName,
//     contractFolderName,
//     controllerOutFolder: join(rootFolderPath, controllerFolderName),
//     // for serviceGen
//     serviceOutFolder: join(rootFolderPath, serviceFolderName),
//     entityFolderName
//   }
// ).generate()

new ModuleGen(
  { mapping },
  {
    controllerFolderName,
    serviceFolderName,
    entityFolderName,
    outFolder: join(rootFolderPath, moduleFolderName)
  }
).generate()

console.log("finish")
