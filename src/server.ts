/**
 * Server Setup
 * 
 * Responsibilities:
 * - Initialize Express app
 * - Register middleware (CORS, body parsing, logging)
 * - Mount API routes
 * - Start HTTP server
 * - Handle graceful shutdown
 * 
 * This file contains NO business logic or LLM integration.
 * It only orchestrates the HTTP layer.
 */

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { appConfig } from './config/app.config';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './api/middleware/error.middleware';
import queryRoutes from './api/routes/query.routes';
import explainRoutes from './api/routes/explain.routes';

/**
 * Creates and configures the Express application
 */
export function createApp(): Application {
    const app = express();

    // ============================================================
    // MIDDLEWARE SETUP
    // ============================================================

    // Enable CORS
    app.use(cors(appConfig.cors));

    // Parse JSON request bodies
    app.use(express.json({ limit: '1mb' }));

    // Request logging middleware
    app.use((req: Request, res: Response, next) => {
        logger.info('Incoming request', {
            method: req.method,
            path: req.path,
            ip: req.ip,
        });
        next();
    });

    // ============================================================
    // ============================================================
    // ROOT ROUTE - Helpful message for beginners
    // ============================================================

    app.get('/', (req: Request, res: Response) => {
        res.json({
            message: 'This is an API-only service. No web UI is available at this route.',
            endpoints: {
                health: 'GET /health',
                search: 'POST /api/search',
                explain: 'POST /api/explain',
            },
            documentation: 'See README.md for usage instructions',
            tip: 'Use /health to check if the server is running',
        });
    });

    // ============================================================
    // HEALTH CHECK
    // ============================================================

    app.get('/health', (req: Request, res: Response) => {
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'jaeger-ai-query-service',
        });
    });

    // ============================================================
    // API ROUTES
    // ============================================================

    // Mount query translation routes
    app.use('/api', queryRoutes);

    // Mount span explanation routes
    app.use('/api', explainRoutes);

    // ============================================================
    // ERROR HANDLING
    // ============================================================

    // 404 handler for unmatched routes
    app.use(notFoundHandler);

    // Global error handler (must be last)
    app.use(errorHandler);

    return app;
}

/**
 * Starts the HTTP server
 */
export function startServer(): void {
    const app = createApp();
    const port = appConfig.port;


    const server = app.listen(port, () => {
        logger.info(`🚀 Server started successfully`);
        logger.info(`📍 Listening on: http://localhost:${port}`);
        logger.info(`🌍 Environment: ${appConfig.env}`);
        logger.info('');
        logger.info('📌 Available Endpoints:');
        logger.info('  POST   http://localhost:' + port + '/api/search   - Natural language → Jaeger params');
        logger.info('  POST   http://localhost:' + port + '/api/explain  - Span → Technical summary');
        logger.info('  GET    http://localhost:' + port + '/health       - Health check');
        logger.info('');
        logger.info('✅ Ready to accept requests!');
    });

    // ============================================================
    // GRACEFUL SHUTDOWN
    // ============================================================

    const shutdown = (signal: string) => {
        logger.info(`${signal} received, shutting down gracefully...`);

        server.close(() => {
            logger.info('Server closed. Process exiting.');
            process.exit(0);
        });

        // Force shutdown after 10 seconds
        setTimeout(() => {
            logger.error('Forced shutdown after timeout');
            process.exit(1);
        }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
}
