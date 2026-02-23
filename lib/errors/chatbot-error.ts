export class ChatbotError extends Error {
  public readonly statusCode?: number;
  public readonly code?: string;

  constructor(message: string, options?: { statusCode?: number; code?: string; cause?: unknown }) {
    super(message);
    this.name = 'ChatbotError';
    this.statusCode = options?.statusCode;
    this.code = options?.code;

    if (options?.cause) {
      (this as any).cause = options.cause;
    }
  }
}

