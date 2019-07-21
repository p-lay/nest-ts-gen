"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class DefinitionGen {
    constructor(sourceFolder, outFolder, excludes = null) {
        this.defaultExcludePrefixs = ["_"];
        this.sourceFolder = sourceFolder;
        this.outFolder = outFolder;
        this.excludePrefixs = excludes || this.defaultExcludePrefixs;
    }
    generate() {
        const fileNames = fs
            .readdirSync(this.sourceFolder)
            .filter(x => !this.excludePrefixs.includes(x[0]));
        fileNames.forEach(fileName => {
            fs.readFile(this.sourceFolder + "/" + fileName, null, (err, buff) => {
                const removeExport = buff.toString().replace(/export /g, "");
                const removeImport = removeExport.replace(/import [\s\S]+['|"]\n/g, "");
                fs.writeFileSync(this.outFolder + "/" + fileName.replace(".ts", ".d.ts"), removeImport, { flag: "w" });
            });
        });
    }
}
exports.DefinitionGen = DefinitionGen;
