import mapping from "./contract/_mapping"
import { generateNest, generateFront } from "../src/main"
import { join } from "path"

// front-end
const contractFolderName = "contract"
const typeFolderName = "type"
// back-end
const controllerFolderName = "controller"
const serviceFolderName = "service"
const entityFolderName = "entity"
const moduleFolderName = "module"

generateFront({
  mapping,
  sourceContractFolderPath: join(__dirname, "contract"),
  outFolderPath: join(__dirname, "output/front", typeFolderName)
})

generateNest({
  mapping,
  rootFolderPath: join(__dirname, "output/nest"),
  sourceContractFolderRelativePath: "../../../contract",
  serviceFolderName,
  controllerFolderName,
  entityFolderName,
  moduleFolderName
})

console.log("finish")
