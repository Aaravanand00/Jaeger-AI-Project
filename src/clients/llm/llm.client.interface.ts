/**
 * LLM Client Interface
 * 
 * Abstract interface for LLM providers.
 * Enables swapping between OpenAI, Anthropic, local models, or mocks.
 */

/**
 * Standard request format for LLM completion
 */
export interface LLMCompletionRequest {
    /**
     * The full prompt text (including system + user messages)
     */
    prompt: string;

    /**
     * Temperature: 0 = deterministic, 1 = creative
     * For Jaeger queries, this should be 0
     */
    temperature?: number;

    /**
     * Maximum tokens to generate
     */
    maxTokens?: number;

    /**
     * Model identifier (e.g., "gpt-4", "claude-3")
     */
    model?: string;
}

/**
 * Standard response format from LLM
 */
export interface LLMCompletionResponse {
    /**
     * Generated text
     */
    content: string;

    /**
     * Provider-specific metadata
     */
    metadata?: {
        model?: string;
        tokensUsed?: number;
        provider?: string;
    };
}

/**
 * Abstract LLM Client Interface
 * 
 * All LLM providers must implement this interface.
 */
export interface ILLMClient {
    /**
     * Generate a completion from a prompt
     */
    complete(request: LLMCompletionRequest): Promise<LLMCompletionResponse>;

    /**
     * Check if the client is properly configured
     */
    isConfigured(): boolean;

    /**
     * Get the provider name
     */
    getProvider(): string;
}
