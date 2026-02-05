/**
 * Jaeger Search Parameters Schema
 * 
 * Defines the structure for Jaeger trace search queries.
 * This matches Jaeger's actual search API parameters.
 * 
 * Reference: https://www.jaegertracing.io/docs/latest/apis/
 */

/**
 * Core search parameters that Jaeger accepts
 */
export interface JaegerSearchParams {
    /**
     * Service name (required in Jaeger)
     * e.g., "frontend", "payment-service", "user-api"
     */
    service: string;

    /**
     * Operation name (optional)
     * e.g., "HTTP GET /api/users", "ProcessPayment", "SELECT * FROM users"
     */
    operation?: string | null;

    /**
     * Key-value tags for filtering
     * e.g., { "http.status_code": "500", "error": "true", "db.type": "postgres" }
     */
    tags?: Record<string, string>;

    /**
     * Minimum span duration filter
     * Format: "500ms", "2s", "100us"
     */
    minDuration?: string | null;

    /**
     * Maximum span duration filter
     * Format: "5s", "1m"
     */
    maxDuration?: string | null;

    /**
     * Lookback time range
     * e.g., "1h", "24h", "7d"
     * Default: "1h"
     */
    lookback?: string;

    /**
     * Maximum number of traces to return
     * Default: 20
     */
    limit?: number;
}

/**
 * Validation helper: Ensures service is present
 */
export function isValidJaegerSearch(params: unknown): params is JaegerSearchParams {
    if (!params || typeof params !== 'object') return false;
    const p = params as Partial<JaegerSearchParams>;
    return typeof p.service === 'string' && p.service.length > 0;
}

/**
 * Default values for optional fields
 */
export const DEFAULT_SEARCH_PARAMS: Partial<JaegerSearchParams> = {
    lookback: '1h',
    limit: 20,
    tags: {},
};
