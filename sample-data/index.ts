/**
 * Sample Data Index
 * 
 * Central export for all sample Jaeger span and trace data.
 * 
 * Purpose:
 * - Prototype demonstration
 * - Testing the AI query service
 * - Helping maintainers understand data shapes
 * - Documentation and examples
 * 
 * ⚠️ This is FAKE data for development and testing only.
 */

export { httpSpans } from './http-spans';
export { databaseSpans } from './database-spans';
export { completeTraces } from './complete-traces';

/**
 * Quick access to all spans as a flat array
 */
export const allSpans = {
    http: [],    // Populated from http-spans.ts
    database: [], // Populated from database-spans.ts
};

/**
 * Usage examples:
 * 
 * ```typescript
 * import { httpSpans, databaseSpans, completeTraces } from './sample-data';
 * 
 * // Test with a successful HTTP request
 * const span = httpSpans.successfulGet;
 * 
 * // Test with a slow database query
 * const slowQuery = databaseSpans.slowQuery;
 * 
 * // Test with a complete checkout flow
 * const checkout = completeTraces.successfulCheckout;
 * ```
 */
