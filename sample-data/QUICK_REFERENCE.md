# Sample Data Quick Reference

## HTTP Spans

| Span | Scenario | Duration | Status | Use For |
|------|----------|----------|--------|---------|
| `successfulGet` | Fast HTTP GET | 45ms | 200 OK | Testing normal requests |
| `postRequest` | HTTP POST with logs | 125ms | 201 Created | Testing POST operations |
| `slowRequest` | Performance issue | 3.5s | 200 OK | Testing slow request detection |
| `serverError` | Internal server error | 85ms | 500 Error | Testing error handling |
| `notFound` | Resource not found | 12ms | 404 Not Found | Testing 404 scenarios |
| `retriedRequest` | Request with retries | 5.2s | 200 OK | Testing retry logic with logs |

## Database Spans

| Span | Database | Scenario | Duration | Use For |
|------|----------|----------|----------|---------|
| `fastSelect` | PostgreSQL | Index hit | 3.5ms | Testing fast queries |
| `slowQuery` | PostgreSQL | Missing index | 850ms | Testing slow query detection |
| `mongoAggregation` | MongoDB | Aggregation pipeline | 245ms | Testing NoSQL operations |
| `redisCacheHit` | Redis | Cache hit | 0.8ms | Testing cache hits |
| `redisCacheMiss` | Redis | Cache miss | 1.2ms | Testing cache misses |
| `mysqlInsert` | MySQL | Transaction | 45ms | Testing write operations |
| `connectionError` | PostgreSQL | Timeout | 5s | Testing connection failures |
| `elasticsearchQuery` | Elasticsearch | Search | 125ms | Testing search operations |

## Complete Traces

| Trace | Services | Spans | Duration | Outcome | Use For |
|-------|----------|-------|----------|---------|---------|
| `successfulCheckout` | 5 microservices | 8 | 425ms | Success | Testing distributed tracing |
| `failedCheckout` | 3 microservices | 4 | 325ms | Payment failed | Testing error propagation |
| `userLogin` | Auth + Cache + DB | 6 | 125ms | Success | Testing caching behavior |

## Performance Thresholds

### HTTP Requests
- **Fast**: < 100ms
- **Normal**: 100-500ms
- **Slow**: 500ms-2s
- **Critical**: > 2s

### Database Queries
- **Fast**: < 50ms
- **Normal**: 50-200ms
- **Slow**: 200ms-1s
- **Critical**: > 1s

## Tag Examples

### HTTP Tags
```typescript
{ key: "http.method", value: "GET" }
{ key: "http.status_code", value: 200 }
{ key: "http.url", value: "..." }
{ key: "span.kind", value: "client" }
{ key: "component", value: "fetch" }
```

### Database Tags
```typescript
{ key: "db.type", value: "postgres" }
{ key: "db.statement", value: "SELECT ..." }
{ key: "db.user", value: "app_user" }
{ key: "db.rows_affected", value: 1 }
```

### Error Tags
```typescript
{ key: "error", value: true }
{ key: "http.status_code", value: 500 }
```

## Import Examples

```typescript
// Import all HTTP spans
import { httpSpans } from './sample-data';
const span = httpSpans.successfulGet;

// Import all database spans
import { databaseSpans } from './sample-data';
const slowDb = databaseSpans.slowQuery;

// Import complete traces
import { completeTraces } from './sample-data';
const trace = completeTraces.successfulCheckout;
```
