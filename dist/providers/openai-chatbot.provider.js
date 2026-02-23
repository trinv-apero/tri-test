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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var OpenAIChatbotProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIChatbotProvider = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = require("openai");
const ai_provider_interface_1 = require("../interfaces/ai-provider.interface");
const tokens_1 = require("../tokens");
const chatbot_config_1 = require("../config/chatbot-config");
const chatbot_error_1 = require("../errors/chatbot-error");
let OpenAIChatbotProvider = OpenAIChatbotProvider_1 = class OpenAIChatbotProvider {
    constructor(config, logger) {
        this.config = config;
        this.clients = new Map();
        const nestLogger = new common_1.Logger(OpenAIChatbotProvider_1.name);
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
    getDefaultClient() {
        return this.getClient(ai_provider_interface_1.SupportedModel.INHOUSE);
    }
    createAssistant(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const client = this.getDefaultClient();
            try {
                const nameSuffix = Date.now().toString(36);
                const assistant = yield client.beta.assistants.create({
                    model: ai_provider_interface_1.SupportedModel.INHOUSE,
                    name: `${params.name}-${nameSuffix}`,
                    description: params.description,
                    instructions: params.instructions,
                });
                this.logger.log(`Created OpenAI assistant: ${assistant.id}`);
                return {
                    id: assistant.id,
                    model: assistant.model,
                    name: (_a = assistant.name) !== null && _a !== void 0 ? _a : '',
                    description: (_b = assistant.description) !== null && _b !== void 0 ? _b : undefined,
                    instructions: (_c = assistant.instructions) !== null && _c !== void 0 ? _c : '',
                    createdAt: assistant.created_at,
                };
            }
            catch (error) {
                this.logger.error(`Failed to create OpenAI assistant: ${error.message}`, error.stack);
                throw new chatbot_error_1.ChatbotError(`OpenAI API error: ${error.message}`, {
                    statusCode: 502,
                    code: 'OPENAI_ASSISTANT_CREATE_FAILED',
                    cause: error,
                });
            }
        });
    }
    getAssistant(id, model) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const client = this.getClient(model);
                const assistant = yield client.beta.assistants.retrieve(id);
                return {
                    id: assistant.id,
                    model: assistant.model,
                    name: (_a = assistant.name) !== null && _a !== void 0 ? _a : '',
                    description: (_b = assistant.description) !== null && _b !== void 0 ? _b : undefined,
                    instructions: (_c = assistant.instructions) !== null && _c !== void 0 ? _c : '',
                    createdAt: assistant.created_at,
                };
            }
            catch (error) {
                this.logger.error(`Failed to get OpenAI assistant ${id}: ${error.message}`);
                throw new chatbot_error_1.ChatbotError(`OpenAI API error: ${error.message}`, {
                    statusCode: 502,
                    code: 'OPENAI_ASSISTANT_GET_FAILED',
                    cause: error,
                });
            }
        });
    }
    updateAssistant(id, params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const client = this.getDefaultClient();
            try {
                const assistant = yield client.beta.assistants.update(id, {
                    name: params.name,
                    description: params.description,
                    instructions: params.instructions,
                });
                return {
                    id: assistant.id,
                    model: assistant.model,
                    name: (_a = assistant.name) !== null && _a !== void 0 ? _a : '',
                    description: (_b = assistant.description) !== null && _b !== void 0 ? _b : undefined,
                    instructions: (_c = assistant.instructions) !== null && _c !== void 0 ? _c : '',
                    createdAt: assistant.created_at,
                };
            }
            catch (error) {
                this.logger.error(`Failed to update OpenAI assistant ${id}: ${error.message}`);
                throw new chatbot_error_1.ChatbotError(`OpenAI API error: ${error.message}`, {
                    statusCode: 502,
                    code: 'OPENAI_ASSISTANT_UPDATE_FAILED',
                    cause: error,
                });
            }
        });
    }
    deleteAssistant(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getDefaultClient().beta.assistants.delete(id);
                this.logger.log(`Deleted OpenAI assistant: ${id}`);
            }
            catch (error) {
                this.logger.error(`Failed to delete OpenAI assistant ${id}: ${error.message}`);
            }
        });
    }
    createThread(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = this.getClient(params.model);
            try {
                const thread = yield client.beta.threads.create({
                    metadata: params.metadata,
                });
                this.logger.log(`Created OpenAI thread: ${thread.id}`);
                return {
                    id: thread.id,
                    createdAt: thread.created_at,
                };
            }
            catch (error) {
                this.logger.error(`Failed to create OpenAI thread: ${error.message}`);
                throw new chatbot_error_1.ChatbotError(`OpenAI API error: ${error.message}`, {
                    statusCode: 502,
                    code: 'OPENAI_THREAD_CREATE_FAILED',
                    cause: error,
                });
            }
        });
    }
    deleteThread(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getDefaultClient().beta.threads.delete(id);
                this.logger.log(`Deleted OpenAI thread: ${id}`);
            }
            catch (error) {
                this.logger.error(`Failed to delete OpenAI thread ${id}: ${error.message}`);
            }
        });
    }
    sendMessageStream(params) {
        return __asyncGenerator(this, arguments, function* sendMessageStream_1() {
            var _a, e_1, _b, _c;
            const client = this.getClient(params.model);
            try {
                yield __await(client.beta.threads.messages.create(params.threadId, {
                    role: 'user',
                    content: params.content,
                }));
                const stream = yield __await(client.beta.threads.runs.createAndStream(params.threadId, {
                    assistant_id: params.assistantId,
                    model: params.model,
                }));
                try {
                    for (var _d = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = yield __await(stream_1.next()), _a = stream_1_1.done, !_a; _d = true) {
                        _c = stream_1_1.value;
                        _d = false;
                        const event = _c;
                        yield yield __await(event);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = stream_1.return)) yield __await(_b.call(stream_1));
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            catch (error) {
                this.logger.error(`OpenAI Stream Error: ${error.message}`);
                throw new chatbot_error_1.ChatbotError(`OpenAI streaming error: ${error.message}`, {
                    statusCode: 502,
                    code: 'OPENAI_STREAM_FAILED',
                    cause: error,
                });
            }
        });
    }
    cancelRun(threadId, runId, model) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = this.getClient(model);
            yield client.beta.threads.runs.cancel(runId, {
                thread_id: threadId,
            });
            this.logger.log(`Cancelled run ${runId} in thread ${threadId}`);
        });
    }
    deleteMessage(threadId, messageId, model) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = this.getClient(model);
                yield client.beta.threads.messages.delete(messageId, {
                    thread_id: threadId,
                });
                this.logger.log(`Deleted message ${messageId} in thread ${threadId}`);
            }
            catch (error) {
                this.logger.error(`Failed to delete message ${messageId}: ${error.message}`);
                throw new chatbot_error_1.ChatbotError(`OpenAI API error: ${error.message}`, {
                    statusCode: 502,
                    code: 'OPENAI_MESSAGE_DELETE_FAILED',
                    cause: error,
                });
            }
        });
    }
};
exports.OpenAIChatbotProvider = OpenAIChatbotProvider;
exports.OpenAIChatbotProvider = OpenAIChatbotProvider = OpenAIChatbotProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(tokens_1.CHATBOT_CONFIG)),
    __param(1, (0, common_1.Inject)(tokens_1.CHATBOT_LOGGER)),
    __metadata("design:paramtypes", [Object, Object])
], OpenAIChatbotProvider);
//# sourceMappingURL=openai-chatbot.provider.js.map