import mapping from "./contract/_mapping"
import { generateNest, generateFront } from "../lib"
import { join } from "path"

generateFront({
  mapping,
  sourceContractFolderPath: join(__dirname, "contract"),
  outFolderPath: join(__dirname, "output/front/type")
})

generateNest({
  mapping,
  // the relative contract folder path in template import expression => import { CommonRes } from '../../../contract/global'
  sourceContractFolderRelativePath: "../../../contract", 
  // the relative entity path in template import expression => import { UserEntity } from '../entity/user.entity'
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
