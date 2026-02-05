/**
 * Sample HTTP Request Spans
 * 
 * Realistic examples of HTTP requests captured by Jaeger.
 * These represent typical web service calls with various outcomes.
 */

export const httpSpans = {
    /**
     * Successful GET request - Fast response
     */
    successfulGet: {
        spanID: "abc123def456",
        traceID: "trace-001-http-success",
        operationName: "HTTP GET /api/users",
        serviceName: "frontend-service",
        startTime: 1675234567000000, // microseconds since epoch
        duration: 45000, // 45ms
        tags: [
            { key: "http.method", value: "GET" },
            { key: "http.url", value: "https://api.example.com/api/users" },
            { key: "http.status_code", value: 200 },
            { key: "span.kind", value: "client" },
            { key: "component", value: "fetch" },
            { key: "http.host", value: "api.example.com" },
        ],
        logs: [],
    },

    /**
     * POST request with payload - Normal latency
     */
    postRequest: {
        spanID: "post789abc123",
        traceID: "trace-002-http-post",
        operationName: "HTTP POST /api/orders",
        serviceName: "order-service",
        startTime: 1675234568000000,
        duration: 125000, // 125ms
        tags: [
            { key: "http.method", value: "POST" },
            { key: "http.url", value: "https://api.example.com/api/orders" },
            { key: "http.status_code", value: 201 },
            { key: "span.kind", value: "server" },
            { key: "component", value: "express" },
            { key: "http.route", value: "/api/orders" },
        ],
        logs: [
            {
                timestamp: 1675234568050000,
                fields: [
                    { key: "event", value: "request.received" },
                    { key: "payload.size", value: 1024 },
                ],
            },
            {
                timestamp: 1675234568120000,
                fields: [
                    { key: "event", value: "response.sent" },
                    { key: "order.id", value: "ORD-12345" },
                ],
            },
        ],
    },

    /**
     * Slow HTTP request - Performance issue
     */
    slowRequest: {
        spanID: "slow999xyz888",
        traceID: "trace-003-http-slow",
        operationName: "HTTP GET /api/reports",
        serviceName: "reporting-service",
        startTime: 1675234569000000,
        duration: 3500000, // 3.5 seconds - very slow!
        tags: [
            { key: "http.method", value: "GET" },
            { key: "http.url", value: "https://api.example.com/api/reports" },
            { key: "http.status_code", value: 200 },
            { key: "span.kind", value: "client" },
            { key: "component", value: "axios" },
            { key: "http.query", value: "start=2024-01-01&end=2024-12-31" },
        ],
        logs: [
            {
                timestamp: 1675234569000000,
                fields: [
                    { key: "event", value: "request.start" },
                ],
            },
            {
                timestamp: 1675234572500000,
                fields: [
                    { key: "event", value: "response.complete" },
                    { key: "warning", value: "Large dataset processed" },
                ],
            },
        ],
    },

    /**
     * HTTP 500 Internal Server Error
     */
    serverError: {
        spanID: "err500internal",
        traceID: "trace-004-http-error",
        operationName: "HTTP POST /api/payment",
        serviceName: "payment-service",
        startTime: 1675234570000000,
        duration: 85000, // 85ms before failing
        tags: [
            { key: "http.method", value: "POST" },
            { key: "http.url", value: "https://api.example.com/api/payment" },
            { key: "http.status_code", value: 500 },
            { key: "span.kind", value: "server" },
            { key: "error", value: true },
            { key: "component", value: "express" },
        ],
        logs: [
            {
                timestamp: 1675234570080000,
                fields: [
                    { key: "event", value: "error" },
                    { key: "error.kind", value: "InternalServerError" },
                    { key: "message", value: "Database connection timeout" },
                    { key: "stack", value: "Error: Database connection timeout\n    at PaymentController.processPayment..." },
                ],
            },
        ],
    },

    /**
     * HTTP 404 Not Found
     */
    notFound: {
        spanID: "err404notfound",
        traceID: "trace-005-http-404",
        operationName: "HTTP GET /api/users/99999",
        serviceName: "user-service",
        startTime: 1675234571000000,
        duration: 12000, // 12ms - fast but not found
        tags: [
            { key: "http.method", value: "GET" },
            { key: "http.url", value: "https://api.example.com/api/users/99999" },
            { key: "http.status_code", value: 404 },
            { key: "span.kind", value: "server" },
            { key: "component", value: "express" },
            { key: "http.route", value: "/api/users/:id" },
        ],
        logs: [
            {
                timestamp: 1675234571010000,
                fields: [
                    { key: "event", value: "user.not_found" },
                    { key: "user.id", value: "99999" },
                ],
            },
        ],
    },

    /**
     * HTTP request with retry
     */
    retriedRequest: {
        spanID: "retry3times",
        traceID: "trace-006-http-retry",
        operationName: "HTTP GET /api/external",
        serviceName: "integration-service",
        startTime: 1675234572000000,
        duration: 5200000, // 5.2s total (includes retries)
        tags: [
            { key: "http.method", value: "GET" },
            { key: "http.url", value: "https://external-api.com/data" },
            { key: "http.status_code", value: 200 },
            { key: "span.kind", value: "client" },
            { key: "component", value: "fetch" },
            { key: "retry.count", value: 3 },
        ],
        logs: [
            {
                timestamp: 1675234572000000,
                fields: [
                    { key: "event", value: "attempt.1" },
                    { key: "result", value: "Connection timeout" },
                ],
            },
            {
                timestamp: 1675234573000000,
                fields: [
                    { key: "event", value: "attempt.2" },
                    { key: "result", value: "Connection timeout" },
                ],
            },
            {
                timestamp: 1675234575000000,
                fields: [
                    { key: "event", value: "attempt.3" },
                    { key: "result", value: "Success" },
                ],
            },
        ],
    },
};

export default httpSpans;
