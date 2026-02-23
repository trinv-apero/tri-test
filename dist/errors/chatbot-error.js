"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotError = void 0;
class ChatbotError extends Error {
    constructor(message, options) {
        super(message);
        this.name = 'ChatbotError';
        this.statusCode = options === null || options === void 0 ? void 0 : options.statusCode;
        this.code = options === null || options === void 0 ? void 0 : options.code;
        if (options === null || options === void 0 ? void 0 : options.cause) {
            this.cause = options.cause;
        }
    }
}
exports.ChatbotError = ChatbotError;
//# sourceMappingURL=chatbot-error.js.map