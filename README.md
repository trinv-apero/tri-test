## @apero/chatbot

NestJS core AI chatbot library for assistants, threads, and chat completions.

This package exposes framework-friendly services on top of the OpenAI client so that
your NestJS applications can:

- Create and manage AI assistants and threads.
- Send messages to assistants and consume streaming responses.
- Perform simple, stateless chat completions (messages in, reply out).

The library intentionally excludes any persistence (database/Prisma) and HTTP
controllers. You keep full control over your storage and API layer.

### Installation

```bash
yarn add @apero/chatbot openai
```

### Basic usage

Register the module in your Nest application and provide `CHATBOT_CONFIG`:

```ts
import { Module } from '@nestjs/common';
import {
  ChatbotModule,
  CHATBOT_CONFIG,
  ChatbotConfig,
  ChatCompletionsService,
} from '@apero/chatbot';

const chatbotConfig: ChatbotConfig = {
  INHOUSE: {
    apiKey: process.env.OPENAI_API_KEY as string,
    baseUrl: process.env.OPENAI_BASE_URL,
  },
};

@Module({
  imports: [ChatbotModule],
  providers: [
    {
      provide: CHATBOT_CONFIG,
      useValue: chatbotConfig,
    },
  ],
})
export class AppModule {}
```

Inject and use `ChatCompletionsService` in your own controller:

```ts
import { Controller, Post, Body } from '@nestjs/common';
import { ChatCompletionsService, ChatCompletionRequest } from '@apero/chatbot';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatCompletionsService: ChatCompletionsService) {}

  @Post('completions')
  async createCompletion(@Body() body: ChatCompletionRequest) {
    return this.chatCompletionsService.execute(body);
  }
}
```

Use `ChatbotAssistantService` for assistants/threads and streaming:

```ts
import { ChatbotAssistantService, SupportedModel } from '@apero/chatbot';

// Example (inside a service or controller)
async function* streamReply(
  chatbotAssistantService: ChatbotAssistantService,
  threadId: string,
  assistantId: string,
) {
  const stream = chatbotAssistantService.sendMessageStream({
    threadId,
    assistantId,
    content: 'Hello!',
    model: SupportedModel.INHOUSE,
  });

  for await (const event of stream) {
    yield event;
  }
}
```

You wire this stream to SSE or WebSocket in your application layer.

