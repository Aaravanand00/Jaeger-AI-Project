/**
 * Validation Middleware
 * 
 * Placeholder for request validation.
 * Will integrate with Zod or Joi schemas later.
 */

import { Request, Response, NextFunction } from 'express';
import { ApiError } from './error.middleware';

/**
 * Validates that request body exists and is not empty
 */
export function validateBody(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (!req.body || Object.keys(req.body).length === 0) {
        throw new ApiError(400, 'Request body is required');
    }
    next();
}

/**
 * Placeholder for schema-based validation
 * TODO: Integrate with Zod schemas
 */
export function validateSchema(schema: unknown) {
    return (req: Request, res: Response, next: NextFunction): void => {
        // Schema validation will be implemented here
        // For now, just pass through
        next();
    };
}
