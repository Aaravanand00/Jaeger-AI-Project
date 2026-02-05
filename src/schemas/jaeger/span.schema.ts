/**
 * Jaeger Span Schema
 * 
 * Defines the structure of a Jaeger trace span.
 * Based on OpenTelemetry and Jaeger's data model.
 * 
 * Reference: https://www.jaegertracing.io/docs/latest/apis/
 */

/**
 * Tag/Attribute on a span
 */
export interface SpanTag {
    key: string;
    value: string | number | boolean;
}

/**
 * Log event within a span
 */
export interface SpanLog {
    timestamp: number; // microseconds since epoch
    fields: SpanTag[];
}

/**
 * Reference to another span (e.g., parent, follows-from)
 */
export interface SpanReference {
    refType: 'CHILD_OF' | 'FOLLOWS_FROM';
    traceID: string;
    spanID: string;
}

/**
 * Core Jaeger Span structure
 */
export interface JaegerSpan {
    /**
     * Unique span ID
     */
    spanID: string;

    /**
     * Trace ID this span belongs to
     */
    traceID: string;

    /**
     * Operation name (e.g., "HTTP GET /api/users", "SELECT * FROM users")
     */
    operationName: string;

    /**
     * Service name that generated this span
     */
    serviceName: string;

    /**
     * Start time in microseconds since epoch
     */
    startTime: number;

    /**
     * Duration in microseconds
     */
    duration: number;

    /**
     * Tags/attributes on the span
     */
    tags: SpanTag[];

    /**
     * Log events within the span
     */
    logs?: SpanLog[];

    /**
     * References to other spans
     */
    references?: SpanReference[];

    /**
     * Process information (service details)
     */
    process?: {
        serviceName: string;
        tags?: SpanTag[];
    };
}

/**
 * Helper to get a tag value by key
 */
export function getTagValue(span: JaegerSpan, key: string): string | number | boolean | undefined {
    const tag = span.tags.find(t => t.key === key);
    return tag?.value;
}

/**
 * Helper to check if span has an error
 */
export function hasError(span: JaegerSpan): boolean {
    const errorTag = getTagValue(span, 'error');
    if (errorTag === true || errorTag === 'true') return true;

    const statusCode = getTagValue(span, 'http.status_code');
    if (typeof statusCode === 'number' && statusCode >= 500) return true;
    if (typeof statusCode === 'string' && parseInt(statusCode) >= 500) return true;

    return false;
}

/**
 * Helper to format duration in human-readable form
 */
export function formatDuration(durationMicros: number): string {
    if (durationMicros < 1000) return `${durationMicros}μs`;
    if (durationMicros < 1000000) return `${(durationMicros / 1000).toFixed(2)}ms`;
    return `${(durationMicros / 1000000).toFixed(2)}s`;
}

/**
 * Validate basic span structure
 */
export function isValidSpan(data: unknown): data is JaegerSpan {
    if (!data || typeof data !== 'object') return false;
    const span = data as Partial<JaegerSpan>;

    return !!(
        span.spanID &&
        span.traceID &&
        span.operationName &&
        span.serviceName &&
        typeof span.duration === 'number' &&
        Array.isArray(span.tags)
    );
}
