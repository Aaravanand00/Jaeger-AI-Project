/**
 * Sample Complete Traces
 * 
 * Realistic examples of complete distributed traces with multiple spans.
 * These show how requests flow through microservices.
 */

export const completeTraces = {
    /**
     * E-commerce checkout flow - Successful transaction
     * 
     * Flow: API Gateway → Auth → Order Service → Payment Service → Inventory Service
     */
    successfulCheckout: {
        traceID: "trace-checkout-success-001",
        spans: [
            // 1. API Gateway receives request
            {
                spanID: "span-001-gateway",
                traceID: "trace-checkout-success-001",
                operationName: "HTTP POST /api/checkout",
                serviceName: "api-gateway",
                startTime: 1675234567000000,
                duration: 425000, // 425ms total
                tags: [
                    { key: "http.method", value: "POST" },
                    { key: "http.url", value: "/api/checkout" },
                    { key: "http.status_code", value: 200 },
                    { key: "span.kind", value: "server" },
                    { key: "component", value: "nginx" },
                ],
                references: [],
            },

            // 2. Auth service validates token
            {
                spanID: "span-002-auth",
                traceID: "trace-checkout-success-001",
                operationName: "validateToken",
                serviceName: "auth-service",
                startTime: 1675234567010000,
                duration: 15000, // 15ms
                tags: [
                    { key: "span.kind", value: "server" },
                    { key: "component", value: "jwt" },
                    { key: "user.id", value: "user-123" },
                ],
                references: [
                    {
                        refType: "CHILD_OF",
                        traceID: "trace-checkout-success-001",
                        spanID: "span-001-gateway",
                    },
                ],
            },

            // 3. Order service creates order
            {
                spanID: "span-003-order",
                traceID: "trace-checkout-success-001",
                operationName: "createOrder",
                serviceName: "order-service",
                startTime: 1675234567030000,
                duration: 385000, // 385ms
                tags: [
                    { key: "span.kind", value: "server" },
                    { key: "order.id", value: "ORD-456789" },
                    { key: "order.total", value: 99.99 },
                ],
                references: [
                    {
                        refType: "CHILD_OF",
                        traceID: "trace-checkout-success-001",
                        spanID: "span-001-gateway",
                    },
                ],
            },

            // 4. Database: Insert order
            {
                spanID: "span-004-db-order",
                traceID: "trace-checkout-success-001",
                operationName: "INSERT INTO orders",
                serviceName: "order-service",
                startTime: 1675234567035000,
                duration: 25000, // 25ms
                tags: [
                    { key: "db.type", value: "postgres" },
                    { key: "db.statement", value: "INSERT INTO orders (user_id, total, status) VALUES ($1, $2, $3)" },
                    { key: "span.kind", value: "client" },
                ],
                references: [
                    {
                        refType: "CHILD_OF",
                        traceID: "trace-checkout-success-001",
                        spanID: "span-003-order",
                    },
                ],
            },

            // 5. Payment service processes payment
            {
                spanID: "span-005-payment",
                traceID: "trace-checkout-success-001",
                operationName: "processPayment",
                serviceName: "payment-service",
                startTime: 1675234567070000,
                duration: 285000, // 285ms
                tags: [
                    { key: "span.kind", value: "server" },
                    { key: "payment.method", value: "credit_card" },
                    { key: "payment.id", value: "PAY-789123" },
                ],
                references: [
                    {
                        refType: "CHILD_OF",
                        traceID: "trace-checkout-success-001",
                        spanID: "span-003-order",
                    },
                ],
                logs: [
                    {
                        timestamp: 1675234567080000,
                        fields: [
                            { key: "event", value: "payment.authorized" },
                        ],
                    },
                    {
                        timestamp: 1675234567350000,
                        fields: [
                            { key: "event", value: "payment.captured" },
                        ],
                    },
                ],
            },

            // 6. External payment gateway call
            {
                spanID: "span-006-stripe",
                traceID: "trace-checkout-success-001",
                operationName: "HTTP POST /v1/charges",
                serviceName: "payment-service",
                startTime: 1675234567085000,
                duration: 265000, // 265ms - external API
                tags: [
                    { key: "http.method", value: "POST" },
                    { key: "http.url", value: "https://api.stripe.com/v1/charges" },
                    { key: "http.status_code", value: 200 },
                    { key: "span.kind", value: "client" },
                    { key: "component", value: "stripe" },
                ],
                references: [
                    {
                        refType: "CHILD_OF",
                        traceID: "trace-checkout-success-001",
                        spanID: "span-005-payment",
                    },
                ],
            },

            // 7. Inventory service reserves items
            {
                spanID: "span-007-inventory",
                traceID: "trace-checkout-success-001",
                operationName: "reserveItems",
                serviceName: "inventory-service",
                startTime: 1675234567360000,
                duration: 45000, // 45ms
                tags: [
                    { key: "span.kind", value: "server" },
                    { key: "items.count", value: 3 },
                ],
                references: [
                    {
                        refType: "CHILD_OF",
                        traceID: "trace-checkout-success-001",
                        spanID: "span-003-order",
                    },
                ],
            },

            // 8. Database: Update inventory
            {
                spanID: "span-008-db-inventory",
                traceID: "trace-checkout-success-001",
                operationName: "UPDATE inventory",
                serviceName: "inventory-service",
                startTime: 1675234567365000,
                duration: 35000, // 35ms
                tags: [
                    { key: "db.type", value: "postgres" },
                    { key: "db.statement", value: "UPDATE inventory SET reserved = reserved + $1 WHERE product_id = $2" },
                    { key: "span.kind", value: "client" },
                    { key: "db.rows_affected", value: 3 },
                ],
                references: [
                    {
                        refType: "CHILD_OF",
                        traceID: "trace-checkout-success-001",
                        spanID: "span-007-inventory",
                    },
                ],
            },
        ],
    },

    /**
     * Failed checkout - Payment declined
     * 
     * Flow: API Gateway → Auth → Order Service → Payment Service (FAILS)
     */
    failedCheckout: {
        traceID: "trace-checkout-failed-002",
        spans: [
            // 1. API Gateway
            {
                spanID: "span-101-gateway",
                traceID: "trace-checkout-failed-002",
                operationName: "HTTP POST /api/checkout",
                serviceName: "api-gateway",
                startTime: 1675234580000000,
                duration: 325000, // 325ms
                tags: [
                    { key: "http.method", value: "POST" },
                    { key: "http.status_code", value: 402 }, // Payment Required
                    { key: "span.kind", value: "server" },
                    { key: "error", value: true },
                ],
                references: [],
            },

            // 2. Auth validates
            {
                spanID: "span-102-auth",
                traceID: "trace-checkout-failed-002",
                operationName: "validateToken",
                serviceName: "auth-service",
                startTime: 1675234580010000,
                duration: 12000,
                tags: [
                    { key: "span.kind", value: "server" },
                    { key: "user.id", value: "user-456" },
                ],
                references: [
                    {
                        refType: "CHILD_OF",
                        traceID: "trace-checkout-failed-002",
                        spanID: "span-101-gateway",
                    },
                ],
            },

            // 3. Payment service attempts payment
            {
                spanID: "span-103-payment",
                traceID: "trace-checkout-failed-002",
                operationName: "processPayment",
                serviceName: "payment-service",
                startTime: 1675234580030000,
                duration: 285000,
                tags: [
                    { key: "span.kind", value: "server" },
                    { key: "error", value: true },
                    { key: "payment.method", value: "credit_card" },
                ],
                references: [
                    {
                        refType: "CHILD_OF",
                        traceID: "trace-checkout-failed-002",
                        spanID: "span-101-gateway",
                    },
                ],
                logs: [
                    {
                        timestamp: 1675234580310000,
                        fields: [
                            { key: "event", value: "error" },
                            { key: "error.kind", value: "PaymentDeclined" },
                            { key: "message", value: "Insufficient funds" },
                            { key: "card.last4", value: "4242" },
                        ],
                    },
                ],
            },

            // 4. External payment gateway rejects
            {
                spanID: "span-104-stripe",
                traceID: "trace-checkout-failed-002",
                operationName: "HTTP POST /v1/charges",
                serviceName: "payment-service",
                startTime: 1675234580040000,
                duration: 270000,
                tags: [
                    { key: "http.method", value: "POST" },
                    { key: "http.url", value: "https://api.stripe.com/v1/charges" },
                    { key: "http.status_code", value: 402 },
                    { key: "span.kind", value: "client" },
                    { key: "error", value: true },
                ],
                references: [
                    {
                        refType: "CHILD_OF",
                        traceID: "trace-checkout-failed-002",
                        spanID: "span-103-payment",
                    },
                ],
                logs: [
                    {
                        timestamp: 1675234580310000,
                        fields: [
                            { key: "event", value: "error" },
                            { key: "error.type", value: "card_error" },
                            { key: "error.code", value: "insufficient_funds" },
                        ],
                    },
                ],
            },
        ],
    },

    /**
     * User login flow with caching
     * 
     * Flow: Frontend → Auth Service → Redis (cache miss) → Database → Session Creation
     */
    userLogin: {
        traceID: "trace-login-003",
        spans: [
            // 1. Frontend initiates login
            {
                spanID: "span-201-frontend",
                traceID: "trace-login-003",
                operationName: "HTTP POST /auth/login",
                serviceName: "frontend-service",
                startTime: 1675234590000000,
                duration: 125000,
                tags: [
                    { key: "http.method", value: "POST" },
                    { key: "http.status_code", value: 200 },
                    { key: "span.kind", value: "client" },
                ],
                references: [],
            },

            // 2. Auth service receives request
            {
                spanID: "span-202-auth",
                traceID: "trace-login-003",
                operationName: "login",
                serviceName: "auth-service",
                startTime: 1675234590005000,
                duration: 115000,
                tags: [
                    { key: "span.kind", value: "server" },
                    { key: "auth.method", value: "credentials" },
                ],
                references: [
                    {
                        refType: "CHILD_OF",
                        traceID: "trace-login-003",
                        spanID: "span-201-frontend",
                    },
                ],
            },

            // 3. Check Redis for cached user (miss)
            {
                spanID: "span-203-redis",
                traceID: "trace-login-003",
                operationName: "GET user:email:user@example.com",
                serviceName: "auth-service",
                startTime: 1675234590010000,
                duration: 1500,
                tags: [
                    { key: "db.type", value: "redis" },
                    { key: "cache.hit", value: false },
                    { key: "span.kind", value: "client" },
                ],
                references: [
                    {
                        refType: "CHILD_OF",
                        traceID: "trace-login-003",
                        spanID: "span-202-auth",
                    },
                ],
            },

            // 4. Fetch user from database
            {
                spanID: "span-204-db",
                traceID: "trace-login-003",
                operationName: "SELECT users WHERE email = ?",
                serviceName: "auth-service",
                startTime: 1675234590015000,
                duration: 25000,
                tags: [
                    { key: "db.type", value: "postgres" },
                    { key: "db.statement", value: "SELECT * FROM users WHERE email = $1" },
                    { key: "span.kind", value: "client" },
                ],
                references: [
                    {
                        refType: "CHILD_OF",
                        traceID: "trace-login-003",
                        spanID: "span-202-auth",
                    },
                ],
            },

            // 5. Verify password (bcrypt - slow)
            {
                spanID: "span-205-bcrypt",
                traceID: "trace-login-003",
                operationName: "verifyPassword",
                serviceName: "auth-service",
                startTime: 1675234590045000,
                duration: 65000, // 65ms - intentionally slow for security
                tags: [
                    { key: "component", value: "bcrypt" },
                    { key: "bcrypt.rounds", value: 12 },
                ],
                references: [
                    {
                        refType: "CHILD_OF",
                        traceID: "trace-login-003",
                        spanID: "span-202-auth",
                    },
                ],
            },

            // 6. Create session in Redis
            {
                spanID: "span-206-session",
                traceID: "trace-login-003",
                operationName: "SET session:xyz789",
                serviceName: "auth-service",
                startTime: 1675234590115000,
                duration: 2000,
                tags: [
                    { key: "db.type", value: "redis" },
                    { key: "db.statement", value: "SET session:xyz789 {...} EX 3600" },
                    { key: "span.kind", value: "client" },
                    { key: "session.ttl", value: 3600 },
                ],
                references: [
                    {
                        refType: "CHILD_OF",
                        traceID: "trace-login-003",
                        spanID: "span-202-auth",
                    },
                ],
            },
        ],
    },
};

export default completeTraces;
