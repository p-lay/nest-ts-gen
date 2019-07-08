import mapping from "./contract/_mapping"
import { ContractGen } from "./util/contract.gen"
import { DefinitionReplace } from "./util/definition.replace"

const sourceFolder = __dirname + "/contract"
const outFolder = __dirname + "/type"

new ContractGen({ mapping, outFolder }).generate()
new DefinitionReplace(sourceFolder, outFolder).replace()
