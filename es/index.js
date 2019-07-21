"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const controller_gen_1 = require("./nest/controller.gen");
const module_gen_1 = require("./nest/module.gen");
const contract_gen_1 = require("./front/contract.gen");
const definition_gen_1 = require("./front/definition.gen");
function generateNest(param) {
    const { mapping, sourceContractFolderRelativePath, sourceEntityFolderRelativePath, outFolderInfo: { rootPath, controllerFolder, serviceFolder, moduleFolder } } = param;
    new controller_gen_1.ControllerGen({
        mapping
    }, {
        serviceFolderName: serviceFolder,
        sourceContractFolderRelativePath,
        controllerOutFolder: path_1.join(rootPath, controllerFolder),
        serviceOutFolder: path_1.join(rootPath, serviceFolder),
        sourceEntityFolderRelativePath
    }).generate();
    new module_gen_1.ModuleGen({ mapping }, {
        controllerFolderName: controllerFolder,
        serviceFolderName: serviceFolder,
        sourceEntityFolderRelativePath,
        outFolder: path_1.join(rootPath, moduleFolder)
    }).generate();
}
exports.generateNest = generateNest;
function generateFront(param) {
    const { mapping, outFolderPath, sourceContractFolderPath } = param;
    new contract_gen_1.ContractGen({
        mapping,
        outFolderPath
    }).generate();
    new definition_gen_1.DefinitionGen(sourceContractFolderPath, outFolderPath).generate();
}
exports.generateFront = generateFront;
