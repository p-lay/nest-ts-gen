import { BaseRender } from "../baseRender";
import { Method } from "../type/global";
declare type Param = {
    mapping: any;
};
declare type Config = {
    outFolder: string;
    controllerFolderName: string;
    serviceFolderName: string;
    sourceEntityFolderRelativePath: string;
};
export declare class ModuleGen extends BaseRender {
    constructor(param: Param, config: Config);
    mapping: any;
    config: Config;
    getPrefixKey(key: string): string;
    getControllerName(key: string): string;
    getServiceName(key: string): string;
    getEntityName(key: string): string;
    getServiceContractTypes(service: Method): string[];
    renderModuleController(): string;
    renderModuleService(): string;
    renderModuleEntity(): string;
    generate(): void;
}
export {};
