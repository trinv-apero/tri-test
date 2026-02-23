export interface ChatbotModelConfig {
  apiKey: string;
  baseUrl?: string;
  maxRetries?: number;
  timeout?: number;
}

export type ChatbotConfig = Record<string, ChatbotModelConfig>;

export function getModelConfig(model: string, config: ChatbotConfig): ChatbotModelConfig {
  const modelConfig = config[model];
  if (!modelConfig || !modelConfig.apiKey) {
    throw new Error(`Chatbot configuration for model '${model}' is missing or incomplete.`);
  }
  return {
    baseUrl: modelConfig.baseUrl,
    maxRetries: modelConfig.maxRetries ?? 3,
    timeout: modelConfig.timeout ?? 30000,
    apiKey: modelConfig.apiKey,
  };
}

