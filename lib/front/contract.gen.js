"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const baseRender_1 = require("../baseRender");
class ContractGen extends baseRender_1.BaseRender {
    constructor(param) {
        super();
        this.defaultConfig = {
            mappingFileName: "mapping.d.ts",
            typeName: "ContractType"
        };
        const { mapping, mappingConfig } = this.getMappingInfo(param.mapping);
        this.mapping = mapping;
        this.mappingConfig = mappingConfig;
        this.outFolder = param.outFolderPath;
        const paramConfig = param.config || {};
        this.config = Object.assign({}, this.defaultConfig, paramConfig);
    }
    renderMappingType() {
        return `type Mapping = {${this.renderModels()}\r}`;
    }
    renderModels() {
        let modelStr = "";
        for (const modelKey in this.mapping) {
            const { model, modelConfig } = this.getModelInfo(this.mapping[modelKey]);
            if (modelConfig.disableController)
                continue;
            modelStr += `${this.addLine(1)}${modelKey}: {${this.renderMethods(model)}${this.addLine(1)}}`;
        }
        return modelStr;
    }
    renderMethods(model) {
        let methodStr = "";
        for (const methodKey in model) {
            const { method } = this.getMethodInfo(model[methodKey]);
            methodStr += `${this.addLine(2)}${methodKey}: {${this.renderMethod(method)}${this.addLine(2)}}`;
        }
        return methodStr;
    }
    renderMethod(method) {
        let dtoStr = "";
        const keys = Object.keys(method);
        let reqTypeStr = method.req;
        if (!reqTypeStr || !keys.includes("req")) {
            reqTypeStr = "any";
        }
        dtoStr += `${this.addLine(3)}req: ${reqTypeStr}`;
        const resType = method.res;
        let resTypeStr = resType;
        if (!resTypeStr || !keys.includes("res")) {
            resTypeStr = "any";
        }
        else {
            resTypeStr = `${resTypeStr}`;
        }
        dtoStr += `${this.addLine(3)}res: ${resTypeStr}`;
        return dtoStr;
    }
    renderContractType() {
        const controllers = Object.keys(this.mapping)
            .filter(modelKey => {
            const { modelConfig } = this.getModelInfo(this.mapping[modelKey]);
            return !modelConfig.disableController;
        })
            .map(controller => `Mapping['${controller}']`);
        return `type ${this.config.typeName} = ${controllers.join(" & ")}`;
    }
    generate() {
        const mappingType = this.renderMappingType();
        const contractType = this.renderContractType();
        fs.writeFileSync(this.outFolder + "/" + this.config.mappingFileName, mappingType + "\r" + contractType);
    }
}
exports.ContractGen = ContractGen;
