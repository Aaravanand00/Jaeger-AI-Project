/**
 * Explain Routes
 * 
 * Defines routing for span explanation.
 */

import { Router } from 'express';
import { explainSpan } from '../controllers/explain.controller';
import { validateBody } from '../middleware/validation.middleware';

const router = Router();

/**
 * POST /explain
 * Generates structured explanation for a span
 * 
 * Expected body: { spanId: string, traceId: string, spanData: object }
 */
router.post('/explain', validateBody, explainSpan);

export default router;
