import OpenAI from 'openai';
import { CreateAssistantParams, CreateThreadParams, IAIProvider, ProviderAssistant, ProviderThread, SendMessageParams, SupportedModel } from '../interfaces/ai-provider.interface';
export declare class ChatbotAssistantService {
    private readonly provider;
    constructor(provider: IAIProvider);
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
