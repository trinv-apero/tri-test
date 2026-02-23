import { Inject, Injectable } from '@nestjs/common';
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
import { AI_PROVIDER } from '../tokens';

@Injectable()
export class ChatbotAssistantService {
  constructor(@Inject(AI_PROVIDER) private readonly provider: IAIProvider) {}

  createAssistant(params: CreateAssistantParams): Promise<ProviderAssistant> {
    return this.provider.createAssistant(params);
  }

  getAssistant(id: string, model: SupportedModel): Promise<ProviderAssistant> {
    return this.provider.getAssistant(id, model);
  }

  updateAssistant(
    id: string,
    params: Partial<CreateAssistantParams>,
  ): Promise<ProviderAssistant> {
    return this.provider.updateAssistant(id, params);
  }

  deleteAssistant(id: string): Promise<void> {
    return this.provider.deleteAssistant(id);
  }

  createThread(params: CreateThreadParams): Promise<ProviderThread> {
    return this.provider.createThread(params);
  }

  deleteThread(id: string): Promise<void> {
    return this.provider.deleteThread(id);
  }

  sendMessageStream(
    params: SendMessageParams,
  ): AsyncIterable<OpenAI.Beta.Assistants.AssistantStreamEvent> {
    return this.provider.sendMessageStream(params);
  }

  cancelRun(threadId: string, runId: string, model: SupportedModel): Promise<void> {
    return this.provider.cancelRun(threadId, runId, model);
  }

  deleteMessage(
    threadId: string,
    messageId: string,
    model: SupportedModel,
  ): Promise<void> {
    return this.provider.deleteMessage(threadId, messageId, model);
  }
}

