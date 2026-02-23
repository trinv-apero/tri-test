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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotAssistantService = void 0;
const common_1 = require("@nestjs/common");
const tokens_1 = require("../tokens");
let ChatbotAssistantService = class ChatbotAssistantService {
    constructor(provider) {
        this.provider = provider;
    }
    createAssistant(params) {
        return this.provider.createAssistant(params);
    }
    getAssistant(id, model) {
        return this.provider.getAssistant(id, model);
    }
    updateAssistant(id, params) {
        return this.provider.updateAssistant(id, params);
    }
    deleteAssistant(id) {
        return this.provider.deleteAssistant(id);
    }
    createThread(params) {
        return this.provider.createThread(params);
    }
    deleteThread(id) {
        return this.provider.deleteThread(id);
    }
    sendMessageStream(params) {
        return this.provider.sendMessageStream(params);
    }
    cancelRun(threadId, runId, model) {
        return this.provider.cancelRun(threadId, runId, model);
    }
    deleteMessage(threadId, messageId, model) {
        return this.provider.deleteMessage(threadId, messageId, model);
    }
};
exports.ChatbotAssistantService = ChatbotAssistantService;
exports.ChatbotAssistantService = ChatbotAssistantService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(tokens_1.AI_PROVIDER)),
    __metadata("design:paramtypes", [Object])
], ChatbotAssistantService);
//# sourceMappingURL=chatbot-assistant.service.js.map