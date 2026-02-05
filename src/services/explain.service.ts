/**
 * Explain Service
 * 
 * Business logic for generating span explanations.
 * This service orchestrates the LLM client and prompt construction.
 */

import { ILLMClient } from '../clients/llm/llm.client.interface';
import { buildExplainSpanPrompt, ExplanationResult } from '../prompts/explain.prompt';
import { JaegerSpan, isValidSpan } from '../schemas/jaeger/span.schema';
import { logger } from '../utils/logger';

/**
 * Input to the explain service
 */
export interface ExplainSpanRequest {
    /**
     * The span to explain
     */
    span: JaegerSpan;
}

/**
 * Output from the explain service
 */
export interface ExplainSpanResponse {
    /**
     * Generated explanation
     */
    explanation: ExplanationResult;

    /**
     * Original span ID and trace ID
     */
    spanContext: {
        spanID: string;
        traceID: string;
    };

    /**
     * Metadata about the explanation
     */
    metadata: {
        provider: string;
        processingTimeMs: number;
    };
}

/**
 * Explain Service
 * 
 * Generates technical explanations for Jaeger spans.
 */
export class ExplainService {
    constructor(private llmClient: ILLMClient) { }

    /**
     * Generate explanation for a span
     */
    async explainSpan(request: ExplainSpanRequest): Promise<ExplainSpanResponse> {
        const startTime = Date.now();

        logger.info('Explaining span', {
            spanID: request.span.spanID,
            traceID: request.span.traceID,
            operation: request.span.operationName,
        });

        // Validate input
        if (!isValidSpan(request.span)) {
            throw new Error('Invalid span structure');
        }

        // Build the prompt
        const prompt = buildExplainSpanPrompt(request.span);

        // Call LLM
        const llmResponse = await this.llmClient.complete({
            prompt,
            temperature: 0, // Deterministic output
            maxTokens: 800,
        });

        // Parse JSON response
        const explanation = this.parseExplanation(llmResponse.content);

        const processingTimeMs = Date.now() - startTime;

        logger.info('Span explained successfully', {
            spanID: request.span.spanID,
            spanType: explanation.spanType,
            hasError: explanation.errorInfo?.hasError || false,
            processingTimeMs,
        });

        return {
            explanation,
            spanContext: {
                spanID: request.span.spanID,
                traceID: request.span.traceID,
            },
            metadata: {
                provider: this.llmClient.getProvider(),
                processingTimeMs,
            },
        };
    }

    /**
     * Parse LLM response into ExplanationResult
     * Handles various edge cases and malformed JSON
     */
    private parseExplanation(rawResponse: string): ExplanationResult {
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
            const parsed = JSON.parse(cleaned) as ExplanationResult;

            // Validate required fields
            if (!parsed.summary || !parsed.spanType || !parsed.performance) {
                throw new Error('Missing required fields in explanation');
            }

            return parsed;
        } catch (error) {
            logger.error('Failed to parse LLM response', {
                response: rawResponse,
                error: error instanceof Error ? error.message : String(error),
            });
            throw new Error('Failed to parse LLM response as JSON');
        }
    }
}
