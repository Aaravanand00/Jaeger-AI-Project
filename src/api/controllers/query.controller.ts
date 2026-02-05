/**
 * Query Controller
 * 
 * Handles natural language → Jaeger search parameters translation.
 * Orchestrates the service layer without containing business logic.
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';
import { QueryService } from '../../services/query.service';
import { MockLLMClient } from '../../clients/llm/mock.client';
import { ApiError } from '../middleware/error.middleware';

// Initialize service with mock LLM client
// In production, swap this with OpenAIClient or other provider
const llmClient = new MockLLMClient();
const queryService = new QueryService(llmClient);

/**
 * POST /search
 * Translates natural language query to Jaeger search parameters
 * 
 * Request body:
 * {
 *   "query": string,
 *   "context"?: { recentServices?: string[], defaultService?: string }
 * }
 */
export async function translateQuery(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // Validate query input
        if (!req.body.query || typeof req.body.query !== 'string') {
            throw new ApiError(400, 'Query string is required', {
                field: 'query',
                type: 'string',
            });
        }

        logger.info('Received search query', { query: req.body.query });

        // Call query service
        const result = await queryService.translateQuery({
            query: req.body.query,
            context: req.body.context,
        });

        // Return structured response
        res.json({
            success: true,
            data: {
                params: result.params,
                originalQuery: result.originalQuery,
                metadata: result.metadata,
            },
        });
    } catch (error) {
        next(error);
    }
}
