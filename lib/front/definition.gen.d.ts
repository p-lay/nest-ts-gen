export declare class DefinitionGen {
    constructor(sourceFolder: string, outFolder: string, excludes?: string[]);
    sourceFolder: string;
    outFolder: string;
    excludePrefixs: string[];
    defaultExcludePrefixs: string[];
    generate(): void;
}
