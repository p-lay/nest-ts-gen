import { MappingConfig, ModelConfig, MethodConfig, Model, Method } from "./type/global";
export declare class BaseRender {
    _mappingConfig: MappingConfig;
    mappingConfig: MappingConfig;
    addLine(tabCount?: number): string;
    upperFirstLetter(str: string): string;
    readonly commonResType: string;
    readonly globalTypeFileName: string;
    getRequestType(str: string): string;
    getControllerResponseType(str: string): string;
    getServiceResponseType(str: string): string;
    getMappingInfo(rawMapping: any): {
        mappingConfig: MappingConfig;
        mapping: any;
    };
    getModelInfo(rawModel: Model): {
        modelConfig: ModelConfig;
        model: {
            [key: string]: Method;
        };
    };
    getMethodInfo(rawMethod: Method): {
        methodConfig: MethodConfig;
        method: any;
    };
}
