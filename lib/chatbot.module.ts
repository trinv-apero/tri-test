import { DynamicModule, Logger, Module } from '@nestjs/common';

import { AI_PROVIDER, CHATBOT_CONFIG, CHATBOT_LOGGER } from './tokens';
import { OpenAIChatbotProvider } from './providers/openai-chatbot.provider';
import { ChatCompletionsService } from './services/chat-completions.service';
import { ChatbotAssistantService } from './services/chatbot-assistant.service';
import { ChatbotLogger } from './interfaces/logger.interface';
import { ChatbotConfig } from './config/chatbot-config';

@Module({
  providers: [
    {
      provide: CHATBOT_LOGGER,
      useFactory: (): ChatbotLogger => {
        const base = new Logger('Chatbot');
        return {
          log: (message: string, context?: string) =>
            base.log(message, context ?? 'Chatbot'),
          error: (message: string, trace?: string, context?: string) =>
            base.error(message, trace, context ?? 'Chatbot'),
        };
      },
    },
    {
      provide: AI_PROVIDER,
      useClass: OpenAIChatbotProvider,
    },
    OpenAIChatbotProvider,
    ChatCompletionsService,
    ChatbotAssistantService,
  ],
  exports: [AI_PROVIDER, ChatCompletionsService, ChatbotAssistantService, CHATBOT_CONFIG],
})
export class ChatbotModule {
  static register(config: ChatbotConfig): DynamicModule {
    return {
      module: ChatbotModule,
      providers: [
        {
          provide: CHATBOT_CONFIG,
          useValue: config,
        },
      ],
      exports: [CHATBOT_CONFIG],
    };
  }
}


