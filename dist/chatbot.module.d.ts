import { DynamicModule } from '@nestjs/common';
import { ChatbotConfig } from './config/chatbot-config';
export declare class ChatbotModule {
    static register(config: ChatbotConfig): DynamicModule;
}
