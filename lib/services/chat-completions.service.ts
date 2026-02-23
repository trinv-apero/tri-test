import { Inject, Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

import { CHATBOT_CONFIG, CHATBOT_LOGGER } from '../tokens';
import { ChatbotConfig, getModelConfig } from '../config/chatbot-config';
import {
  ChatCompletionRequest,
  ChatCompletionResponse,
} from '../interfaces/chat-completion.interface';
import { ChatbotError } from '../errors/chatbot-error';
import { ChatbotLogger } from '../interfaces/logger.interface';

@Injectable()
export class ChatCompletionsService {
  private readonly logger: ChatbotLogger;
  private readonly clients: Map<string, OpenAI> = new Map();

  constructor(
    @Inject(CHATBOT_CONFIG) private readonly config: ChatbotConfig,
    @Inject(CHATBOT_LOGGER) logger: ChatbotLogger | undefined,
  ) {
    const nestLogger = new Logger(ChatCompletionsService.name);
    this.logger =
      logger ??
      ({
        log: (message: string) => nestLogger.log(message),
        error: (message: string, trace?: string) => nestLogger.error(message, trace),
      } satisfies ChatbotLogger);
  }

  private getClient(model: string): OpenAI {
    if (!this.clients.has(model)) {
      const modelConfig = getModelConfig(model as any, this.config);
      this.clients.set(
        model,
        new OpenAI({
          apiKey: modelConfig.apiKey,
          baseURL: modelConfig.baseUrl,
          maxRetries: modelConfig.maxRetries ?? 3,
          timeout: modelConfig.timeout ?? 30000,
        }),
      );
      this.logger.log(`Created OpenAI client for model: ${model}`);
    }
    return this.clients.get(model)!;
  }

  async execute(dto: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const { model, messages } = dto;
    this.logger.log(`Creating chat completion with model: ${model}`);
    try {
      const client = this.getClient(model);
      const formattedMessages = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));
      const completion = await client.chat.completions.create({
        model,
        messages: formattedMessages,
      });
      const responseContent = completion.choices[0]?.message?.content ?? '';
      this.logger.log(`Chat completion successful for model: ${model}`);
      return { message: responseContent };
    } catch (error: any) {
      this.logger.error(`Chat completion failed: ${error.message}`, error.stack);
      throw new ChatbotError(`Chat completion error: ${error.message}`, {
        statusCode: 502,
        code: 'CHAT_COMPLETION_FAILED',
        cause: error,
      });
    }
  }
}

