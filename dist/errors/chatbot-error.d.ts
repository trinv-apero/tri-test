export declare class ChatbotError extends Error {
    readonly statusCode?: number;
    readonly code?: string;
    constructor(message: string, options?: {
        statusCode?: number;
        code?: string;
        cause?: unknown;
    });
}
