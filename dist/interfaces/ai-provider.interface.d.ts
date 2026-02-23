import OpenAI from 'openai';
export interface CreateAssistantParams {
    name: string;
    description?: string;
    instructions: string;
    temperature?: number;
    topP?: number;
    maxTokens?: number;
}
export interface SendMessageParams {
    threadId: string;
    assistantId: string;
    content: string;
    model: SupportedModel;
}
export interface ProviderAssistant {
    id: string;
    model: SupportedModel;
    name: string;
    description?: string;
    instructions: string;
    createdAt: number;
}
export interface CreateThreadParams {
    model: SupportedModel;
    metadata?: Record<string, any>;
}
export interface ProviderThread {
    id: string;
    createdAt: number;
}
export interface IAIProvider {
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
export declare enum SupportedModel {
    INHOUSE = "inhouse"
}
