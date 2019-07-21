import mapping from "./contract/_mapping"
import { generateNest, generateFront } from "../dist"
import { join } from "path"

generateFront({
  mapping,
  sourceContractFolderPath: join(__dirname, "contract"),
  outFolderPath: join(__dirname, "output/front/type")
})

generateNest({
  mapping,
  sourceContractFolderRelativePath: "../../../contract",
  sourceEntityFolderRelativePath: "../entity",
  // out folder must in the same level
  outFolderInfo: {
    rootPath: join(__dirname, "output/nest"),
    controllerFolder: "controller",
    serviceFolder: "service",
    moduleFolder: "module"
  }
})

console.log("finish")
