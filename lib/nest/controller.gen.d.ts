import { BaseRender } from "../baseRender";
import { Method } from "../type/global";
declare type Param = {
    mapping: any;
};
declare type Config = {
    serviceFolderName: string;
    sourceContractFolderRelativePath: string;
    controllerOutFolder: string;
    serviceOutFolder: string;
    sourceEntityFolderRelativePath: string;
};
export declare class ControllerGen extends BaseRender {
    constructor(param: Param, config: Config);
    modelKey: string;
    mapping: any;
    config: Config;
    readonly prefixKey: string;
    readonly className: string;
    readonly serviceName: string;
    readonly allDtoTypes: string[];
    getDtoTypes(method: Method): string[];
    renderImports(): string;
    renderClass(): string;
    renderMethods(): string;
    renderMethod(key: string, method: Method): string;
    renderClassDecorator(): string;
    render(): string;
    generate(): void;
}
export {};
