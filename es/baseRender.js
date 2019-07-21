"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
class BaseRender {
    set mappingConfig(config) {
        this._mappingConfig = (config || {});
        if (!this._mappingConfig.paramName) {
            this._mappingConfig.paramName = "param";
        }
        if (!this._mappingConfig.promiseGenericRes) {
            throw "set mapping config: promiseGenericRes first";
        }
    }
    get mappingConfig() {
        return this._mappingConfig;
    }
    addLine(tabCount) {
        let space = "";
        for (let index = 0; index < 2 * tabCount; index++) {
            space += " ";
        }
        return `\r${space}`;
    }
    upperFirstLetter(str) {
        const firstLetter = str.charAt(0);
        return str.replace(firstLetter, firstLetter.toUpperCase());
    }
    get commonResType() {
        return this.mappingConfig.promiseGenericRes;
    }
    get globalTypeFileName() {
        return "global";
    }
    getRequestType(str) {
        if (!str) {
            return "any";
        }
        else {
            return str;
        }
    }
    getControllerResponseType(str) {
        if (!str || str == "any" || str.toLowerCase() == "object") {
            return this.commonResType;
        }
        else {
            return `${this.commonResType}<${str}>`;
        }
    }
    getServiceResponseType(str) {
        if (!str || str == "any" || str.toLowerCase() == "object") {
            return "Promise<any>";
        }
        else {
            return `Promise<${str}>`;
        }
    }
    getMappingInfo(rawMapping) {
        const { _config } = rawMapping, mapping = __rest(rawMapping, ["_config"]);
        return {
            mappingConfig: (_config || {}),
            mapping
        };
    }
    getModelInfo(rawModel) {
        const { _config } = rawModel, model = __rest(rawModel, ["_config"]);
        return {
            modelConfig: (_config || {}),
            model
        };
    }
    getMethodInfo(rawMethod) {
        const _a = rawMethod, { _config } = _a, method = __rest(_a, ["_config"]);
        return {
            methodConfig: (_config || {}),
            method
        };
    }
}
exports.BaseRender = BaseRender;
