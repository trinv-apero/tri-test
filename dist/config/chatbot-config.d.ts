export interface ChatbotModelConfig {
    apiKey: string;
    baseUrl?: string;
    maxRetries?: number;
    timeout?: number;
}
export type ChatbotConfig = Record<string, ChatbotModelConfig>;
export declare function getModelConfig(model: string, config: ChatbotConfig): ChatbotModelConfig;
