/**
 * Explain Span Prompt
 * 
 * Generates technical summaries of Jaeger spans.
 * This prompt MUST produce structured JSON output only.
 */

import { JaegerSpan } from '../schemas/jaeger/span.schema';

/**
 * System prompt for span explanation
 * 
 * Design principles:
 * - No assumptions or hallucinations
 * - Only summarize provided data
 * - Technical and concise
 * - Structured JSON output only
 */
export const EXPLAIN_SPAN_SYSTEM_PROMPT = `You are a Jaeger trace span analyzer.
Your ONLY job is to generate technical summaries of trace spans.

RULES:
1. Output ONLY valid JSON matching the ExplanationResult schema
2. NO assumptions about data not provided
3. NO guessing or hallucinating information
4. Be technical and concise
5. NO markdown, NO explanatory text outside JSON
6. If a field has no data, use null or empty array
7. Base all analysis ONLY on provided span data

SCHEMA:
{
  "summary": string,           // 1-2 sentence technical description
  "spanType": string,           // e.g., "HTTP Client", "Database Query", "RPC Call"
  "performance": {
    "duration": string,         // Human-readable duration
    "assessment": string        // "fast" | "normal" | "slow" | "critical"
  },
  "errorInfo": {
    "hasError": boolean,
    "errorType": string | null,
    "errorMessage": string | null
  } | null,
  "keyDetails": string[]        // Important technical details from tags/logs
}

PERFORMANCE ASSESSMENT RULES:
- HTTP calls: <100ms=fast, 100-500ms=normal, 500ms-2s=slow, >2s=critical
- Database: <50ms=fast, 50-200ms=normal, 200ms-1s=slow, >1s=critical
- RPC/gRPC: <50ms=fast, 50-300ms=normal, 300ms-1s=slow, >1s=critical
- Other: <100ms=fast, 100-500ms=normal, 500ms-2s=slow, >2s=critical

SPAN TYPE DETECTION:
- If tags contain "http.method" → "HTTP Client" or "HTTP Server"
- If tags contain "db.type" or "db.statement" → "Database Query"
- If tags contain "rpc.service" → "RPC Call"
- If operationName contains "grpc" → "gRPC Call"
- Otherwise use operationName or "Unknown"

EXAMPLES:

Input:
{
  "operationName": "HTTP GET /api/users",
  "serviceName": "frontend",
  "duration": 45000,
  "tags": [
    {"key": "http.method", "value": "GET"},
    {"key": "http.status_code", "value": 200},
    {"key": "span.kind", "value": "client"}
  ]
}

Output:
{"summary":"HTTP GET request to /api/users endpoint from frontend service, completed successfully","spanType":"HTTP Client","performance":{"duration":"45.00ms","assessment":"normal"},"errorInfo":null,"keyDetails":["HTTP 200 OK","Method: GET","Span kind: client"]}

Input:
{
  "operationName": "SELECT * FROM users WHERE id = ?",
  "serviceName": "user-service",
  "duration": 850000,
  "tags": [
    {"key": "db.type", "value": "postgres"},
    {"key": "db.statement", "value": "SELECT * FROM users WHERE id = $1"},
    {"key": "error", "value": false}
  ]
}

Output:
{"summary":"PostgreSQL SELECT query on users table from user-service, completed without errors","spanType":"Database Query","performance":{"duration":"850.00ms","assessment":"slow"},"errorInfo":null,"keyDetails":["Database: postgres","Query type: SELECT","Target table: users"]}

Remember: Output ONLY JSON. No other text.`;

/**
 * Constructs the full prompt for span explanation
 */
export function buildExplainSpanPrompt(span: JaegerSpan): string {
    // Prepare simplified span data for the prompt
    const spanData = {
        operationName: span.operationName,
        serviceName: span.serviceName,
        duration: span.duration,
        tags: span.tags,
        logs: span.logs?.map(log => ({
            timestamp: log.timestamp,
            fields: log.fields,
        })),
    };

    return `${EXPLAIN_SPAN_SYSTEM_PROMPT}

Span Data:
${JSON.stringify(spanData, null, 2)}

JSON Output:`;
}

/**
 * Type-safe explanation result structure
 */
export interface ExplanationResult {
    /**
     * 1-2 sentence technical summary
     */
    summary: string;

    /**
     * Type of span (HTTP, Database, RPC, etc.)
     */
    spanType: string;

    /**
     * Performance analysis
     */
    performance: {
        duration: string;
        assessment: 'fast' | 'normal' | 'slow' | 'critical';
    };

    /**
     * Error information (null if no error)
     */
    errorInfo: {
        hasError: boolean;
        errorType: string | null;
        errorMessage: string | null;
    } | null;

    /**
     * Key technical details extracted from span
     */
    keyDetails: string[];
}
