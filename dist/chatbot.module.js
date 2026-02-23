"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotModule = void 0;
const common_1 = require("@nestjs/common");
const tokens_1 = require("./tokens");
const openai_chatbot_provider_1 = require("./providers/openai-chatbot.provider");
const chat_completions_service_1 = require("./services/chat-completions.service");
const chatbot_assistant_service_1 = require("./services/chatbot-assistant.service");
let ChatbotModule = class ChatbotModule {
};
exports.ChatbotModule = ChatbotModule;
exports.ChatbotModule = ChatbotModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: tokens_1.CHATBOT_LOGGER,
                useFactory: () => {
                    const base = new common_1.Logger('Chatbot');
                    return {
                        log: (message, context) => base.log(message, context !== null && context !== void 0 ? context : 'Chatbot'),
                        error: (message, trace, context) => base.error(message, trace, context !== null && context !== void 0 ? context : 'Chatbot'),
                    };
                },
            },
            {
                provide: tokens_1.AI_PROVIDER,
                useClass: openai_chatbot_provider_1.OpenAIChatbotProvider,
            },
            openai_chatbot_provider_1.OpenAIChatbotProvider,
            chat_completions_service_1.ChatCompletionsService,
            chatbot_assistant_service_1.ChatbotAssistantService,
        ],
        exports: [tokens_1.AI_PROVIDER, chat_completions_service_1.ChatCompletionsService, chatbot_assistant_service_1.ChatbotAssistantService],
    })
], ChatbotModule);
//# sourceMappingURL=chatbot.module.js.map