# Sample Data for Jaeger AI Query Service

## Purpose

This folder contains **realistic but fake** Jaeger trace and span data for:

- ✅ **Prototype demonstration**
- ✅ **Testing the AI query service**
- ✅ **Helping maintainers understand data shapes**
- ✅ **Documentation and examples**

⚠️ **All data in this folder is FAKE and for development/testing only.**

---

## Files

### `http-spans.ts`
Realistic HTTP request spans covering:
- ✅ Successful GET/POST requests
- ✅ Slow requests (performance issues)
- ✅ HTTP 500 errors (server failures)
- ✅ HTTP 404 errors (not found)
- ✅ Retried requests (with retry logs)

**Examples:**
- Fast response: 45ms
- Slow response: 3.5s
- Failed requests with error logs

### `database-spans.ts`
Database operation spans for multiple database types:
- ✅ PostgreSQL: SELECT, INSERT, slow queries
- ✅ MongoDB: Aggregation pipelines
- ✅ Redis: Cache hits and misses
- ✅ MySQL: Transactions
- ✅ Elasticsearch: Search queries
- ✅ Connection errors and timeouts

**Database Types Covered:**
- PostgreSQL (most common)
- MongoDB (NoSQL)
- Redis (caching)
- MySQL (relational)
- Elasticsearch (search)

### `complete-traces.ts`
Full distributed traces with multiple spans:

**Trace 1: Successful E-commerce Checkout**
- Flow: API Gateway → Auth → Order → Payment → Inventory
- Duration: ~425ms
- Spans: 8 (showing full microservice interaction)
- Outcome: Success

**Trace 2: Failed Checkout (Payment Declined)**
- Flow: API Gateway → Auth → Payment (FAILS)
- Duration: ~325ms
- Spans: 4
- Outcome: Payment declined (insufficient funds)

**Trace 3: User Login with Caching**
- Flow: Frontend → Auth → Redis → Database → Session
- Duration: ~125ms
- Spans: 6
- Shows: Cache miss, password verification, session creation

---

## Data Structure

All spans follow the Jaeger/OpenTelemetry data model:

```typescript
interface JaegerSpan {
  spanID: string;              // Unique span identifier
  traceID: string;             // Trace this span belongs to
  operationName: string;       // What operation is being performed
  serviceName: string;         // Which service generated this span
  startTime: number;           // Microseconds since epoch
  duration: number;            // Duration in microseconds
  tags: SpanTag[];            // Key-value metadata
  logs?: SpanLog[];           // Timestamped events
  references?: SpanReference[]; // Links to other spans
}
```

---

## How to Use

### Import specific spans:
```typescript
import { httpSpans } from './sample-data';

// Use a successful GET request
const span = httpSpans.successfulGet;

// Use a slow request for performance testing
const slowSpan = httpSpans.slowRequest;

// Use an error for error handling testing
const errorSpan = httpSpans.serverError;
```

### Import database examples:
```typescript
import { databaseSpans } from './sample-data';

// Fast query
const fast = databaseSpans.fastSelect;

// Slow query (needs optimization)
const slow = databaseSpans.slowQuery;

// Cache hit vs miss
const cacheHit = databaseSpans.redisCacheHit;
const cacheMiss = databaseSpans.redisCacheMiss;
```

### Import complete traces:
```typescript
import { completeTraces } from './sample-data';

// Test with a successful checkout flow
const checkout = completeTraces.successfulCheckout;

// Test with a failed payment
const failed = completeTraces.failedCheckout;
```

---

## Realistic Attributes

### HTTP Spans Include:
- `http.method` (GET, POST, PUT, DELETE)
- `http.status_code` (200, 404, 500)
- `http.url` (full request URL)
- `span.kind` (client or server)
- `component` (fetch, axios, express, nginx)

### Database Spans Include:
- `db.type` (postgres, mongodb, redis, mysql)
- `db.statement` (actual SQL/query)
- `db.instance` (database name)
- `db.user` (database user)
- `db.rows_affected` (for write operations)

### Error Spans Include:
- `error: true` tag
- Error logs with:
  - `error.kind` (type of error)
  - `message` (human-readable description)
  - `stack` (stack trace when applicable)

### Performance Indicators:
- **Fast**: <100ms for HTTP, <50ms for DB
- **Normal**: 100-500ms for HTTP, 50-200ms for DB
- **Slow**: 500ms-2s for HTTP, 200ms-1s for DB
- **Critical**: >2s for HTTP, >1s for DB

---

## Usage in Tests

### Test the Explain Span feature:
```javascript
import { httpSpans } from './sample-data';

const response = await fetch('http://localhost:3000/api/explain', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ span: httpSpans.successfulGet }),
});

const result = await response.json();
console.log(result.data.explanation);
// Output: Technical summary of the span
```

### Test with error scenarios:
```javascript
import { httpSpans, databaseSpans } from './sample-data';

// HTTP error
await explainSpan(httpSpans.serverError);

// Database timeout
await explainSpan(databaseSpans.connectionError);
```

---

## Characteristics of This Data

### ✅ Realistic
- Follows Jaeger/OpenTelemetry specifications
- Uses real-world service names (payment, auth, inventory)
- Realistic durations and error messages
- Proper tag structures

### ✅ Diverse
- Multiple HTTP methods (GET, POST)
- Various database types (SQL, NoSQL, cache)
- Different error types (4xx, 5xx, timeouts)
- Performance scenarios (fast, slow, critical)

### ✅ Educational
- Comments explain each scenario
- Clear naming conventions
- Shows relationships between spans
- Demonstrates best practices

### ✅ Maintainable
- Organized by category (HTTP, DB, traces)
- TypeScript for type safety
- Documented purpose and usage
- Easy to extend with new examples

---

## Adding New Samples

To add new sample data:

1. Choose the appropriate file (http, database, or traces)
2. Follow the existing structure
3. Include realistic tags and logs
4. Add comments explaining the scenario
5. Use descriptive property names

### Template for new span:
```typescript
export const myNewSpan = {
  spanID: "unique-id",
  traceID: "trace-id",
  operationName: "Clear operation name",
  serviceName: "service-name",
  startTime: 1675234567000000,  // microseconds
  duration: 50000,              // microseconds (50ms)
  tags: [
    { key: "span.kind", value: "client" },
    // Add relevant tags
  ],
  logs: [
    // Add logs if needed
  ],
};
```

---

## Notes for Maintainers

### Why This Data Exists
Real Jaeger data is:
- **Sensitive**: Contains production information
- **Inconsistent**: Varies by implementation
- **Complex**: May have custom tags

This sample data provides:
- **Safe**: No real customer data
- **Consistent**: Follows best practices
- **Clear**: Well-documented examples

### When to Update
Update this data when:
- Adding new feature examples
- Fixing incorrect data structures
- Adding new database/service types
- Improving test coverage

### What NOT to Do
- ❌ Don't add real production data
- ❌ Don't include secrets or API keys
- ❌ Don't make it too complex
- ❌ Don't forget to document new additions

---

## References

- [Jaeger Data Model](https://www.jaegertracing.io/docs/latest/architecture/#span)
- [OpenTelemetry Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/)
- [Jaeger API Documentation](https://www.jaegertracing.io/docs/latest/apis/)

---

**Last Updated**: 2026-02-05  
**Maintained by**: Jaeger AI Query Service Team
