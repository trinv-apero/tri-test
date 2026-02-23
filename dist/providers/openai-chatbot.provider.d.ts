import OpenAI from 'openai';
import { CreateAssistantParams, CreateThreadParams, IAIProvider, ProviderAssistant, ProviderThread, SendMessageParams, SupportedModel } from '../interfaces/ai-provider.interface';
import { ChatbotConfig } from '../config/chatbot-config';
import { ChatbotLogger } from '../interfaces/logger.interface';
export declare class OpenAIChatbotProvider implements IAIProvider {
    private readonly config;
    private readonly logger;
    private readonly clients;
    constructor(config: ChatbotConfig, logger: ChatbotLogger | undefined);
    private getClient;
    private getDefaultClient;
    createAssistant(params: CreateAssistantParams): Promise<ProviderAssistant>;
    getAssistant(id: string, model: SupportedModel): Promise<ProviderAssistant>;
    updateAssistant(id: string, params: Partial<CreateAssistantParams>): Promise<ProviderAssistant>;
    deleteAssistant(id: string): Promise<void>;
    createThread(params: CreateThreadParams): Promise<ProviderThread>;
    deleteThread(id: string): Promise<void>;
    sendMessageStream(params: SendMessageParams): AsyncIterable<OpenAI.Beta.Assistants.AssistantStreamEvent>;
    cancelRun(threadId: string, runId: string, model: SupportedModel): Promise<void>;
    deleteMessage(threadId: string, messageId: string, model: SupportedModel): Promise<void>;
}
