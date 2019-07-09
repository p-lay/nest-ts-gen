import mapping from "./contract/_mapping"
import { ContractGen } from "./util/.d.ts/contract.gen"
import { DefinitionReplace } from "./util/.d.ts/definition.replace"

const sourceFolder = __dirname + "/contract"
const outFolder = __dirname + "/type"

new ContractGen({ mapping, outFolder }).generate()
new DefinitionReplace(sourceFolder, outFolder).replace()
