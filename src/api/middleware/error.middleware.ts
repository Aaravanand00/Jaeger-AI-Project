/**
 * Error Handling Middleware
 * 
 * Catches all errors in the application and formats them consistently.
 * This is the last middleware in the chain.
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public details?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * Global error handler middleware
 */
export function errorHandler(
    err: Error | ApiError,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    // Log the error
    logger.error('Request error', {
        path: req.path,
        method: req.method,
        error: err.message,
        stack: err.stack,
    });

    // Check if it's an ApiError
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: false,
            error: {
                message: err.message,
                details: err.details,
            },
        });
        return;
    }

    // Generic error response
    res.status(500).json({
        success: false,
        error: {
            message: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined,
        },
    });
}

/**
 * 404 handler for unmatched routes
 */
export function notFoundHandler(req: Request, res: Response): void {
    res.status(404).json({
        success: false,
        error: {
            message: 'Route not found',
            path: req.path,
        },
    });
}
