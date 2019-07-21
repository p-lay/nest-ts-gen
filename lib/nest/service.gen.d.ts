import { BaseRender } from "../baseRender";
import { Method, ModelConfig } from "../type/global";
declare type Param = {
    model: any;
    modelKey: string;
    mappingConfig: any;
    modelConfig: ModelConfig;
};
declare type Config = {
    serviceFolderName: string;
    sourceContractFolderRelativePath: string;
    sourceEntityFolderRelativePath: string;
    outFolder: string;
};
export declare class ServiceGen extends BaseRender {
    constructor(param: Param, config: Config);
    modelKey: string;
    model: any;
    modelConfig: ModelConfig;
    config: Config;
    readonly prefixKey: string;
    readonly className: string;
    readonly entityName: string;
    readonly allDtoTypes: string[];
    getDtoTypes(method: Method): string[];
    replaceMethodHeader(str: string, methodKey: string, method: Method): string;
    renderEntityImports(): string;
    renderImports(): string;
    renderConstructor(): string;
    renderClass(): string;
    renderMethods(): string;
    renderMethod(methodKey: string, method: Method): string;
    renderClassDecorator(): string;
    render(): string;
    replace(str: string): string;
    generate(): void;
}
export {};
