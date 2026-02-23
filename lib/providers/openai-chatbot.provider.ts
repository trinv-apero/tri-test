import { Inject, Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

import {
  CreateAssistantParams,
  CreateThreadParams,
  IAIProvider,
  ProviderAssistant,
  ProviderThread,
  SendMessageParams,
  SupportedModel,
} from '../interfaces/ai-provider.interface';
import { CHATBOT_CONFIG, CHATBOT_LOGGER } from '../tokens';
import { ChatbotConfig, getModelConfig } from '../config/chatbot-config';
import { ChatbotError } from '../errors/chatbot-error';
import { ChatbotLogger } from '../interfaces/logger.interface';

@Injectable()
export class OpenAIChatbotProvider implements IAIProvider {
  private readonly logger: ChatbotLogger;
  private readonly clients: Map<string, OpenAI> = new Map();

  constructor(
    @Inject(CHATBOT_CONFIG) private readonly config: ChatbotConfig,
    @Inject(CHATBOT_LOGGER) logger: ChatbotLogger | undefined,
  ) {
    const nestLogger = new Logger(OpenAIChatbotProvider.name);
    this.logger =
      logger ??
      ({
        log: (message: string) => nestLogger.log(message),
        error: (message: string, trace?: string) => nestLogger.error(message, trace),
      } satisfies ChatbotLogger);
  }

  private getClient(model: SupportedModel): OpenAI {
    if (!this.clients.has(model)) {
      const modelConfig = getModelConfig(model, this.config);
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

  private getDefaultClient(): OpenAI {
    return this.getClient(SupportedModel.INHOUSE);
  }

  async createAssistant(params: CreateAssistantParams): Promise<ProviderAssistant> {
    const client = this.getDefaultClient();
    try {
      const nameSuffix = Date.now().toString(36);
      const assistant = await client.beta.assistants.create({
        model: SupportedModel.INHOUSE,
        name: `${params.name}-${nameSuffix}`,
        description: params.description,
        instructions: params.instructions,
      });
      this.logger.log(`Created OpenAI assistant: ${assistant.id}`);
      return {
        id: assistant.id,
        model: assistant.model as SupportedModel,
        name: assistant.name ?? '',
        description: assistant.description ?? undefined,
        instructions: assistant.instructions ?? '',
        createdAt: assistant.created_at,
      };
    } catch (error: any) {
      this.logger.error(`Failed to create OpenAI assistant: ${error.message}`, error.stack);
      throw new ChatbotError(`OpenAI API error: ${error.message}`, {
        statusCode: 502,
        code: 'OPENAI_ASSISTANT_CREATE_FAILED',
        cause: error,
      });
    }
  }

  async getAssistant(id: string, model: SupportedModel): Promise<ProviderAssistant> {
    try {
      const client = this.getClient(model);
      const assistant = await client.beta.assistants.retrieve(id);
      return {
        id: assistant.id,
        model: assistant.model as SupportedModel,
        name: assistant.name ?? '',
        description: assistant.description ?? undefined,
        instructions: assistant.instructions ?? '',
        createdAt: assistant.created_at,
      };
    } catch (error: any) {
      this.logger.error(`Failed to get OpenAI assistant ${id}: ${error.message}`);
      throw new ChatbotError(`OpenAI API error: ${error.message}`, {
        statusCode: 502,
        code: 'OPENAI_ASSISTANT_GET_FAILED',
        cause: error,
      });
    }
  }

  async updateAssistant(
    id: string,
    params: Partial<CreateAssistantParams>,
  ): Promise<ProviderAssistant> {
    const client = this.getDefaultClient();

    try {
      const assistant = await client.beta.assistants.update(id, {
        name: params.name,
        description: params.description,
        instructions: params.instructions,
      });
      return {
        id: assistant.id,
        model: assistant.model as SupportedModel,
        name: assistant.name ?? '',
        description: assistant.description ?? undefined,
        instructions: assistant.instructions ?? '',
        createdAt: assistant.created_at,
      };
    } catch (error: any) {
      this.logger.error(`Failed to update OpenAI assistant ${id}: ${error.message}`);
      throw new ChatbotError(`OpenAI API error: ${error.message}`, {
        statusCode: 502,
        code: 'OPENAI_ASSISTANT_UPDATE_FAILED',
        cause: error,
      });
    }
  }

  async deleteAssistant(id: string): Promise<void> {
    try {
      await (this.getDefaultClient().beta.assistants as any).delete(id);
      this.logger.log(`Deleted OpenAI assistant: ${id}`);
    } catch (error: any) {
      this.logger.error(`Failed to delete OpenAI assistant ${id}: ${error.message}`);
    }
  }

  async createThread(params: CreateThreadParams): Promise<ProviderThread> {
    const client = this.getClient(params.model);
    try {
      const thread = await client.beta.threads.create({
        metadata: params.metadata,
      });
      this.logger.log(`Created OpenAI thread: ${thread.id}`);
      return {
        id: thread.id,
        createdAt: thread.created_at,
      };
    } catch (error: any) {
      this.logger.error(`Failed to create OpenAI thread: ${error.message}`);
      throw new ChatbotError(`OpenAI API error: ${error.message}`, {
        statusCode: 502,
        code: 'OPENAI_THREAD_CREATE_FAILED',
        cause: error,
      });
    }
  }

  async deleteThread(id: string): Promise<void> {
    try {
      await this.getDefaultClient().beta.threads.delete(id);
      this.logger.log(`Deleted OpenAI thread: ${id}`);
    } catch (error: any) {
      this.logger.error(`Failed to delete OpenAI thread ${id}: ${error.message}`);
    }
  }

  async *sendMessageStream(
    params: SendMessageParams,
  ): AsyncIterable<OpenAI.Beta.Assistants.AssistantStreamEvent> {
    const client = this.getClient(params.model);

    try {
      await client.beta.threads.messages.create(params.threadId, {
        role: 'user',
        content: params.content,
      });

      const stream = await client.beta.threads.runs.createAndStream(params.threadId, {
        assistant_id: params.assistantId,
        model: params.model,
      });

      for await (const event of stream) {
        yield event;
      }
    } catch (error: any) {
      this.logger.error(`OpenAI Stream Error: ${error.message}`);
      throw new ChatbotError(`OpenAI streaming error: ${error.message}`, {
        statusCode: 502,
        code: 'OPENAI_STREAM_FAILED',
        cause: error,
      });
    }
  }

  async cancelRun(threadId: string, runId: string, model: SupportedModel): Promise<void> {
    const client = this.getClient(model);
    await client.beta.threads.runs.cancel(runId, {
      thread_id: threadId,
    });
    this.logger.log(`Cancelled run ${runId} in thread ${threadId}`);
  }

  async deleteMessage(
    threadId: string,
    messageId: string,
    model: SupportedModel,
  ): Promise<void> {
    try {
      const client = this.getClient(model);
      await client.beta.threads.messages.delete(messageId, {
        thread_id: threadId,
      });
      this.logger.log(`Deleted message ${messageId} in thread ${threadId}`);
    } catch (error: any) {
      this.logger.error(`Failed to delete message ${messageId}: ${error.message}`);
      throw new ChatbotError(`OpenAI API error: ${error.message}`, {
        statusCode: 502,
        code: 'OPENAI_MESSAGE_DELETE_FAILED',
        cause: error,
      });
    }
  }
}

