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
  rootFolderPath: join(__dirname, "output/front"),
  typeFolderName,
  sourceContractFolderPath: join(__dirname, "contract"),
})

generateNest({
  mapping,
  rootFolderPath: join(__dirname, "output/nest"),
  contractFolderName,
  serviceFolderName,
  controllerFolderName,
  entityFolderName,
  moduleFolderName
})

console.log("finish")
