import { Logger, Module } from '@nestjs/common';

import { AI_PROVIDER, CHATBOT_LOGGER } from './tokens';
import { OpenAIChatbotProvider } from './providers/openai-chatbot.provider';
import { ChatCompletionsService } from './services/chat-completions.service';
import { ChatbotAssistantService } from './services/chatbot-assistant.service';
import { ChatbotLogger } from './interfaces/logger.interface';

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
  exports: [AI_PROVIDER, ChatCompletionsService, ChatbotAssistantService],
})
export class ChatbotModule {}


