import { ChatbotConfig } from '../config/chatbot-config';
import { ChatCompletionRequest, ChatCompletionResponse } from '../interfaces/chat-completion.interface';
import { ChatbotLogger } from '../interfaces/logger.interface';
export declare class ChatCompletionsService {
    private readonly config;
    private readonly logger;
    private readonly clients;
    constructor(config: ChatbotConfig, logger: ChatbotLogger | undefined);
    private getClient;
    execute(dto: ChatCompletionRequest): Promise<ChatCompletionResponse>;
}
