/**
 * Query Routes
 * 
 * Defines routing for natural language → Jaeger search translation.
 */

import { Router } from 'express';
import { translateQuery } from '../controllers/query.controller';
import { validateBody } from '../middleware/validation.middleware';

const router = Router();

/**
 * POST /search
 * Translates natural language to Jaeger search parameters
 * 
 * Expected body: { query: string, context?: object }
 */
router.post('/search', validateBody, translateQuery);

export default router;
