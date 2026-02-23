export interface ChatbotLogger {
  log(message: string, context?: string): void;
  error(message: string, trace?: string, context?: string): void;
}

