"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var ChatCompletionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatCompletionsService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = require("openai");
const tokens_1 = require("../tokens");
const chatbot_config_1 = require("../config/chatbot-config");
const chatbot_error_1 = require("../errors/chatbot-error");
let ChatCompletionsService = ChatCompletionsService_1 = class ChatCompletionsService {
    constructor(config, logger) {
        this.config = config;
        this.clients = new Map();
        const nestLogger = new common_1.Logger(ChatCompletionsService_1.name);
        this.logger =
            logger !== null && logger !== void 0 ? logger : {
                log: (message) => nestLogger.log(message),
                error: (message, trace) => nestLogger.error(message, trace),
            };
    }
    getClient(model) {
        var _a, _b;
        if (!this.clients.has(model)) {
            const modelConfig = (0, chatbot_config_1.getModelConfig)(model, this.config);
            this.clients.set(model, new openai_1.default({
                apiKey: modelConfig.apiKey,
                baseURL: modelConfig.baseUrl,
                maxRetries: (_a = modelConfig.maxRetries) !== null && _a !== void 0 ? _a : 3,
                timeout: (_b = modelConfig.timeout) !== null && _b !== void 0 ? _b : 30000,
            }));
            this.logger.log(`Created OpenAI client for model: ${model}`);
        }
        return this.clients.get(model);
    }
    execute(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const { model, messages } = dto;
            this.logger.log(`Creating chat completion with model: ${model}`);
            try {
                const client = this.getClient(model);
                const formattedMessages = messages.map((msg) => ({
                    role: msg.role,
                    content: msg.content,
                }));
                const completion = yield client.chat.completions.create({
                    model,
                    messages: formattedMessages,
                });
                const responseContent = (_c = (_b = (_a = completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) !== null && _c !== void 0 ? _c : '';
                this.logger.log(`Chat completion successful for model: ${model}`);
                return { message: responseContent };
            }
            catch (error) {
                this.logger.error(`Chat completion failed: ${error.message}`, error.stack);
                throw new chatbot_error_1.ChatbotError(`Chat completion error: ${error.message}`, {
                    statusCode: 502,
                    code: 'CHAT_COMPLETION_FAILED',
                    cause: error,
                });
            }
        });
    }
};
exports.ChatCompletionsService = ChatCompletionsService;
exports.ChatCompletionsService = ChatCompletionsService = ChatCompletionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(tokens_1.CHATBOT_CONFIG)),
    __param(1, (0, common_1.Inject)(tokens_1.CHATBOT_LOGGER)),
    __metadata("design:paramtypes", [Object, Object])
], ChatCompletionsService);
//# sourceMappingURL=chat-completions.service.js.map