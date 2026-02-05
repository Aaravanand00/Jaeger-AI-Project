/**
 * Sample Database Query Spans
 * 
 * Realistic examples of database operations captured by Jaeger.
 * Covers various database types and performance scenarios.
 */

export const databaseSpans = {
    /**
     * Fast PostgreSQL SELECT query
     */
    fastSelect: {
        spanID: "db-select-fast",
        traceID: "trace-101-db-select",
        operationName: "SELECT users WHERE id = ?",
        serviceName: "user-service",
        startTime: 1675234567100000,
        duration: 3500, // 3.5ms - very fast
        tags: [
            { key: "db.type", value: "postgres" },
            { key: "db.instance", value: "prod-db-01" },
            { key: "db.statement", value: "SELECT * FROM users WHERE id = $1" },
            { key: "db.user", value: "app_user" },
            { key: "span.kind", value: "client" },
            { key: "component", value: "pg" },
            { key: "peer.address", value: "postgres://db.example.com:5432" },
        ],
        logs: [],
    },

    /**
     * Slow PostgreSQL query - missing index
     */
    slowQuery: {
        spanID: "db-slow-noindex",
        traceID: "trace-102-db-slow",
        operationName: "SELECT orders WHERE customer_email = ?",
        serviceName: "order-service",
        startTime: 1675234568000000,
        duration: 850000, // 850ms - needs optimization!
        tags: [
            { key: "db.type", value: "postgres" },
            { key: "db.instance", value: "prod-db-02" },
            { key: "db.statement", value: "SELECT * FROM orders WHERE customer_email = $1" },
            { key: "db.user", value: "app_user" },
            { key: "span.kind", value: "client" },
            { key: "component", value: "sequelize" },
            { key: "db.rows_affected", value: 1247 },
        ],
        logs: [
            {
                timestamp: 1675234568850000,
                fields: [
                    { key: "event", value: "query.complete" },
                    { key: "warning", value: "Seq Scan on orders (cost=0.00..5432.00)" },
                ],
            },
        ],
    },

    /**
     * MongoDB aggregation pipeline
     */
    mongoAggregation: {
        spanID: "mongo-aggregate",
        traceID: "trace-103-mongo",
        operationName: "aggregate sales_data",
        serviceName: "analytics-service",
        startTime: 1675234569000000,
        duration: 245000, // 245ms
        tags: [
            { key: "db.type", value: "mongodb" },
            { key: "db.instance", value: "analytics-cluster" },
            { key: "db.statement", value: 'db.sales.aggregate([{"$match": {"date": {"$gte": "2024-01-01"}}}, {"$group": ...}])' },
            { key: "db.mongodb.collection", value: "sales_data" },
            { key: "span.kind", value: "client" },
            { key: "component", value: "mongoose" },
            { key: "db.operation", value: "aggregate" },
        ],
        logs: [
            {
                timestamp: 1675234569245000,
                fields: [
                    { key: "event", value: "aggregation.complete" },
                    { key: "documents.processed", value: 15420 },
                    { key: "result.count", value: 365 },
                ],
            },
        ],
    },

    /**
     * Redis cache HIT
     */
    redisCacheHit: {
        spanID: "redis-hit",
        traceID: "trace-104-cache-hit",
        operationName: "GET user:12345",
        serviceName: "cache-service",
        startTime: 1675234570000000,
        duration: 800, // 0.8ms - cache hit is fast!
        tags: [
            { key: "db.type", value: "redis" },
            { key: "db.instance", value: "redis-cache-01" },
            { key: "db.statement", value: "GET user:12345" },
            { key: "span.kind", value: "client" },
            { key: "component", value: "ioredis" },
            { key: "peer.address", value: "redis://cache.example.com:6379" },
            { key: "cache.hit", value: true },
        ],
        logs: [],
    },

    /**
     * Redis cache MISS
     */
    redisCacheMiss: {
        spanID: "redis-miss",
        traceID: "trace-105-cache-miss",
        operationName: "GET session:xyz789",
        serviceName: "session-service",
        startTime: 1675234571000000,
        duration: 1200, // 1.2ms - still fast but miss
        tags: [
            { key: "db.type", value: "redis" },
            { key: "db.instance", value: "redis-session-01" },
            { key: "db.statement", value: "GET session:xyz789" },
            { key: "span.kind", value: "client" },
            { key: "component", value: "ioredis" },
            { key: "cache.hit", value: false },
        ],
        logs: [
            {
                timestamp: 1675234571001200,
                fields: [
                    { key: "event", value: "cache.miss" },
                    { key: "action", value: "fetch_from_db" },
                ],
            },
        ],
    },

    /**
     * MySQL INSERT with transaction
     */
    mysqlInsert: {
        spanID: "mysql-insert-tx",
        traceID: "trace-106-mysql-insert",
        operationName: "INSERT INTO payments",
        serviceName: "payment-service",
        startTime: 1675234572000000,
        duration: 45000, // 45ms
        tags: [
            { key: "db.type", value: "mysql" },
            { key: "db.instance", value: "payment-db" },
            { key: "db.statement", value: "INSERT INTO payments (user_id, amount, status) VALUES (?, ?, ?)" },
            { key: "db.user", value: "payment_app" },
            { key: "span.kind", value: "client" },
            { key: "component", value: "mysql2" },
            { key: "db.rows_affected", value: 1 },
            { key: "db.transaction", value: true },
        ],
        logs: [
            {
                timestamp: 1675234572010000,
                fields: [
                    { key: "event", value: "transaction.begin" },
                ],
            },
            {
                timestamp: 1675234572045000,
                fields: [
                    { key: "event", value: "transaction.commit" },
                    { key: "payment.id", value: "PAY-67890" },
                ],
            },
        ],
    },

    /**
     * Database connection error
     */
    connectionError: {
        spanID: "db-conn-err",
        traceID: "trace-107-db-error",
        operationName: "SELECT * FROM products",
        serviceName: "product-service",
        startTime: 1675234573000000,
        duration: 5000000, // 5 seconds - timeout
        tags: [
            { key: "db.type", value: "postgres" },
            { key: "db.instance", value: "prod-db-03" },
            { key: "db.statement", value: "SELECT * FROM products WHERE category = $1" },
            { key: "span.kind", value: "client" },
            { key: "component", value: "pg" },
            { key: "error", value: true },
        ],
        logs: [
            {
                timestamp: 1675234578000000,
                fields: [
                    { key: "event", value: "error" },
                    { key: "error.kind", value: "ConnectionTimeoutError" },
                    { key: "message", value: "Connection timeout after 5000ms" },
                    { key: "error.object", value: "Error: timeout exceeded" },
                ],
            },
        ],
    },

    /**
     * Elasticsearch search query
     */
    elasticsearchQuery: {
        spanID: "es-search",
        traceID: "trace-108-elasticsearch",
        operationName: "search products_index",
        serviceName: "search-service",
        startTime: 1675234574000000,
        duration: 125000, // 125ms
        tags: [
            { key: "db.type", value: "elasticsearch" },
            { key: "db.instance", value: "es-cluster-01" },
            { key: "db.statement", value: '{"query": {"match": {"name": "laptop"}}}' },
            { key: "span.kind", value: "client" },
            { key: "component", value: "@elastic/elasticsearch" },
            { key: "db.elasticsearch.index", value: "products_v2" },
            { key: "db.operation", value: "search" },
        ],
        logs: [
            {
                timestamp: 1675234574125000,
                fields: [
                    { key: "event", value: "search.complete" },
                    { key: "hits.total", value: 342 },
                    { key: "took_ms", value: 89 },
                ],
            },
        ],
    },
};

export default databaseSpans;
