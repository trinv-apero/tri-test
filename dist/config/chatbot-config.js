"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModelConfig = getModelConfig;
function getModelConfig(model, config) {
    var _a, _b;
    const modelConfig = config[model];
    if (!modelConfig || !modelConfig.apiKey) {
        throw new Error(`Chatbot configuration for model '${model}' is missing or incomplete.`);
    }
    return {
        baseUrl: modelConfig.baseUrl,
        maxRetries: (_a = modelConfig.maxRetries) !== null && _a !== void 0 ? _a : 3,
        timeout: (_b = modelConfig.timeout) !== null && _b !== void 0 ? _b : 30000,
        apiKey: modelConfig.apiKey,
    };
}
//# sourceMappingURL=chatbot-config.js.map