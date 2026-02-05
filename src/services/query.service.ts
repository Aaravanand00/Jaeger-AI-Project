/**
 * Query Translation Service
 * 
 * Business logic for converting natural language to Jaeger search parameters.
 * This service orchestrates the LLM client and prompt construction.
 */

import { ILLMClient } from '../clients/llm/llm.client.interface';
import { buildQueryTranslationPrompt } from '../prompts/query.prompt';
import {
    JaegerSearchParams,
    isValidJaegerSearch,
    DEFAULT_SEARCH_PARAMS,
} from '../schemas/jaeger/search-params.schema';
import { logger } from '../utils/logger';

/**
 * Input to the query translation service
 */
export interface TranslateQueryRequest {
    /**
     * Natural language query from the user
     */
    query: string;

    /**
     * Optional context to improve translation
     */
    context?: {
        recentServices?: string[];
        defaultService?: string;
    };
}

/**
 * Output from the query translation service
 */
export interface TranslateQueryResponse {
    /**
     * Structured Jaeger search parameters
     */
    params: JaegerSearchParams;

    /**
     * Original user query
     */
    originalQuery: string;

    /**
     * Metadata about the translation
     */
    metadata: {
        provider: string;
        processingTimeMs: number;
    };
}

/**
 * Query Translation Service
 * 
 * Converts natural language queries into structured Jaeger search parameters.
 */
export class QueryService {
    constructor(private llmClient: ILLMClient) { }

    /**
     * Translate natural language to Jaeger search parameters
     */
    async translateQuery(
        request: TranslateQueryRequest
    ): Promise<TranslateQueryResponse> {
        const startTime = Date.now();

        logger.info('Translating query', { query: request.query });

        // Validate input
        if (!request.query || request.query.trim().length === 0) {
            throw new Error('Query cannot be empty');
        }

        // Build the prompt
        const prompt = buildQueryTranslationPrompt(request.query);

        // Call LLM
        const llmResponse = await this.llmClient.complete({
            prompt,
            temperature: 0, // Deterministic output
            maxTokens: 500,
        });

        // Parse JSON response
        const params = this.parseJaegerParams(llmResponse.content);

        // Ensure service field is present
        if (!params.service) {
            logger.error('LLM failed to extract service name', { params });
            throw new Error('Service name is required but was not extracted');
        }

        // Apply defaults
        const finalParams: JaegerSearchParams = {
            ...DEFAULT_SEARCH_PARAMS,
            ...params,
            service: params.service, // Explicitly set service to satisfy TypeScript
        };

        // Validate
        if (!isValidJaegerSearch(finalParams)) {
            logger.error('Invalid Jaeger params generated', { params: finalParams });
            throw new Error('Failed to generate valid search parameters');
        }

        const processingTimeMs = Date.now() - startTime;

        logger.info('Query translated successfully', {
            service: finalParams.service,
            processingTimeMs,
        });

        return {
            params: finalParams,
            originalQuery: request.query,
            metadata: {
                provider: this.llmClient.getProvider(),
                processingTimeMs,
            },
        };
    }

    /**
     * Parse LLM response into JaegerSearchParams
     * Handles various edge cases and malformed JSON
     */
    private parseJaegerParams(rawResponse: string): Partial<JaegerSearchParams> {
        try {
            // Clean the response (remove markdown, whitespace, etc.)
            let cleaned = rawResponse.trim();

            // Remove markdown code blocks if present
            cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');

            // Extract JSON if there's text before/after
            const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                cleaned = jsonMatch[0];
            }

            // Parse JSON
            const parsed = JSON.parse(cleaned);

            return parsed as Partial<JaegerSearchParams>;
        } catch (error) {
            logger.error('Failed to parse LLM response', {
                response: rawResponse,
                error: error instanceof Error ? error.message : String(error),
            });
            throw new Error('Failed to parse LLM response as JSON');
        }
    }
}
