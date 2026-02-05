/**
 * Explain Controller
 * 
 * Handles span explanation requests.
 * Orchestrates the service layer without containing business logic.
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';
import { ExplainService } from '../../services/explain.service';
import { MockLLMClient } from '../../clients/llm/mock.client';
import { ApiError } from '../middleware/error.middleware';
import { JaegerSpan } from '../../schemas/jaeger/span.schema';

// Initialize service with mock LLM client
// In production, swap this with OpenAIClient or other provider
const llmClient = new MockLLMClient();
const explainService = new ExplainService(llmClient);

/**
 * POST /explain
 * Generates structured explanation for a given span
 * 
 * Request body:
 * {
 *   "span": JaegerSpan  // Full span object with tags, logs, etc.
 * }
 */
export async function explainSpan(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // Validate span input
        if (!req.body.span || typeof req.body.span !== 'object') {
            throw new ApiError(400, 'Span object is required', {
                field: 'span',
                type: 'object',
            });
        }

        const span = req.body.span as JaegerSpan;

        logger.info('Received explain request', {
            spanId: span.spanID,
            traceId: span.traceID,
            operation: span.operationName,
        });

        // Call explain service
        const result = await explainService.explainSpan({ span });

        // Return structured response
        res.json({
            success: true,
            data: {
                explanation: result.explanation,
                spanContext: result.spanContext,
                metadata: result.metadata,
            },
        });
    } catch (error) {
        next(error);
    }
}
