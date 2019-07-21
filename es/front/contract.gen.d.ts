import { BaseRender } from "../baseRender";
export declare type Config = {
    mappingFileName: string;
    typeName: string;
};
export declare type Param = {
    mapping: any;
    outFolderPath: string;
    config?: Partial<Config>;
};
export declare class ContractGen extends BaseRender {
    constructor(param: Param);
    mapping: any;
    outFolder: string;
    defaultConfig: Partial<Config>;
    config: Partial<Config>;
    private renderMappingType;
    private renderModels;
    private renderMethods;
    private renderMethod;
    private renderContractType;
    generate(): void;
}
