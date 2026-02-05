# ✅ Sample Data - Complete

## **What Was Created**

A comprehensive `sample-data/` folder with realistic but fake Jaeger trace and span data.

---

## **Files Created**

### **1. HTTP Spans** (`http-spans.ts`)
**6 realistic HTTP request scenarios:**
- ✅ `successfulGet` - Fast GET request (45ms, 200 OK)
- ✅ `postRequest` - POST with logs (125ms, 201 Created)
- ✅ `slowRequest` - Performance issue (3.5s, 200 OK)
- ✅ `serverError` - Internal error (85ms, 500 Error)
- ✅ `notFound` - Resource not found (12ms, 404)
- ✅ `retriedRequest` - Request with retries (5.2s with retry logs)

**Total**: ~7KB, 200+ lines

---

### **2. Database Spans** (`database-spans.ts`)
**8 realistic database operation scenarios:**
- ✅ `fastSelect` - PostgreSQL fast query (3.5ms)
- ✅ `slowQuery` - PostgreSQL slow query (850ms, needs index)
- ✅ `mongoAggregation` - MongoDB pipeline (245ms)
- ✅ `redisCacheHit` - Cache hit (0.8ms)
- ✅ `redisCacheMiss` - Cache miss (1.2ms)
- ✅ `mysqlInsert` - MySQL transaction (45ms)
- ✅ `connectionError` - Database timeout (5s error)
- ✅ `elasticsearchQuery` - Search operation (125ms)

**Databases covered**: PostgreSQL, MongoDB, Redis, MySQL, Elasticsearch

**Total**: ~9KB, 250+ lines

---

### **3. Complete Traces** (`complete-traces.ts`)
**3 full distributed traces with multiple spans:**

#### **Trace 1: Successful E-commerce Checkout**
- **Services**: API Gateway, Auth, Order, Payment, Inventory
- **Spans**: 8 interconnected spans
- **Duration**: 425ms total
- **Flow**: Complete checkout from request to inventory reservation
- **Outcome**: Success

#### **Trace 2: Failed Checkout (Payment Declined)**
- **Services**: API Gateway, Auth, Payment
- **Spans**: 4 spans
- **Duration**: 325ms
- **Flow**: Checkout attempt with payment failure
- **Outcome**: Payment declined (insufficient funds)

#### **Trace 3: User Login with Caching**
- **Services**: Frontend, Auth, Redis, Database
- **Spans**: 6 spans
- **Duration**: 125ms
- **Flow**: Login → Cache miss → DB lookup → Session creation
- **Outcome**: Success

**Total**: ~18KB, 400+ lines

---

### **4. Index File** (`index.ts`)
Central export point for easy imports:
```typescript
export { httpSpans, databaseSpans, completeTraces };
```

---

### **5. Documentation** (`README.md`)
**Comprehensive guide covering:**
- Purpose and intended use
- Data structure explanation
- Usage examples
- Import patterns
- Adding new samples
- Maintainer notes
- References to Jaeger docs

**Total**: ~8KB, 300+ lines

---

### **6. Quick Reference** (`QUICK_REFERENCE.md`)
**At-a-glance tables showing:**
- All HTTP spans with scenarios
- All database spans by type
- Complete traces overview
- Performance thresholds
- Tag examples
- Import patterns

**Total**: ~3KB, 100+ lines

---

## **Total Statistics**

| Metric | Count |
|--------|-------|
| **Files** | 6 |
| **Total Size** | ~45KB |
| **Total Lines** | ~1,250+ |
| **HTTP Spans** | 6 |
| **Database Spans** | 8 |
| **Complete Traces** | 3 (with 18 total spans) |
| **Database Types** | 5 (Postgres, MongoDB, Redis, MySQL, ES) |
| **Documentation Pages** | 2 |

---

## **Data Characteristics**

### ✅ **Realistic**
- Follows Jaeger/OpenTelemetry specifications exactly
- Uses real-world service names (payment, auth, inventory)
- Realistic durations based on typical performance
- Proper error messages and stack traces
- Authentic tag structures

### ✅ **Diverse**
- **HTTP Methods**: GET, POST
- **Status Codes**: 200, 201, 404, 500, 402
- **Database Types**: SQL, NoSQL, Cache, Search
- **Error Types**: Timeouts, 4xx, 5xx, payment failures
- **Performance**: Fast, normal, slow, critical

### ✅ **Educational**
- Every span has explanatory comments
- Clear naming conventions
- Shows relationships between spans in traces
- Demonstrates best practices
- Includes both success and failure scenarios

### ✅ **Maintainable**
- Organized by category (HTTP, DB, traces)
- TypeScript for type safety
- Well-documented
- Easy to extend
- Clear structure

---

## **Use Cases**

### **1. Testing the Explain Feature**
```typescript
import { httpSpans } from './sample-data';
await explainSpan(httpSpans.successfulGet);
// → "HTTP Client: GET /api/users, 45ms, fast"
```

### **2. Testing Error Detection**
```typescript
import { httpSpans, databaseSpans } from './sample-data';
await explainSpan(httpSpans.serverError);
// → Detects HTTP 500 error with message

await explainSpan(databaseSpans.connectionError);
// → Detects timeout error
```

### **3. Testing Performance Assessment**
```typescript
import { databaseSpans } from './sample-data';
await explainSpan(databaseSpans.slowQuery);
// → "Database Query, 850ms, slow" (flags performance issue)
```

### **4. Testing Distributed Tracing**
```typescript
import { completeTraces } from './sample-data';
const trace = completeTraces.successfulCheckout;
// → 8 spans showing full microservice flow
```

### **5. Documentation Examples**
- Show users what Jaeger data looks like
- Demonstrate expected input format
- Provide copy-paste examples

---

## **Sample Data Coverage**

### **HTTP Scenarios** ✅
- Success (200, 201)
- Client errors (404)
- Server errors (500)
- Slow responses (>3s)
- Retries with logs

### **Database Scenarios** ✅
- Fast queries (<5ms)
- Slow queries (>800ms)
- Cache hits and misses
- Transactions
- Connection errors
- Multiple database types

### **Trace Scenarios** ✅
- Successful multi-service flow
- Failed requests with error propagation
- Caching behavior
- Service dependencies
- Parent-child span relationships

---

## **Integration with Project**

### **Already Used In:**
- ✅ `test-explain.js` - Uses sample spans
- ✅ `simple-explain-test.js` - Uses HTTP spans

### **Can Be Used For:**
- ✅ Unit tests
- ✅ Integration tests
- ✅ Documentation examples
- ✅ README samples
- ✅ Demo presentations
- ✅ Maintainer onboarding

---

## **Key Features**

### **1. Proper Time Units**
All times in **microseconds** (Jaeger standard):
- `startTime`: 1675234567000000 (microseconds since epoch)
- `duration`: 45000 (45ms in microseconds)

### **2. Realistic Tags**
Following OpenTelemetry semantic conventions:
- `http.method`, `http.status_code`, `http.url`
- `db.type`, `db.statement`, `db.user`
- `span.kind` (client/server)
- `component` (library/framework used)

### **3. Meaningful Logs**
Event logs with timestamps:
- Request lifecycle events
- Error details with stack traces
- Performance warnings
- Business events (order created, payment authorized)

### **4. Span References**
Proper parent-child relationships:
- `CHILD_OF` references
- Trace ID consistency
- Shows service dependencies

---

## **Folder Structure**

```
sample-data/
├── http-spans.ts           # 6 HTTP request scenarios
├── database-spans.ts       # 8 database operation scenarios
├── complete-traces.ts      # 3 full distributed traces
├── index.ts                # Central export point
├── README.md               # Comprehensive documentation
└── QUICK_REFERENCE.md      # Quick lookup tables
```

---

## **Purpose Achieved** ✅

### **Goal**: Create realistic but fake sample data

✅ **Realistic**: Follows Jaeger/OTel specs exactly  
✅ **Fake**: No real production data  
✅ **Resembles real data**: Authentic service names, errors, timings  
✅ **Helps maintainers**: Clear structure, well-documented  
✅ **Clearly named folder**: `/sample-data` with README  
✅ **Demonstration ready**: Can be used in tests immediately  

---

## **Next Steps**

### **Use This Data To:**
1. ✅ Test the explain feature with more scenarios
2. ✅ Create automated tests
3. ✅ Generate documentation examples
4. ✅ Demo the service to stakeholders
5. ✅ Onboard new maintainers

### **Extend This Data:**
- Add gRPC call examples
- Add messaging (Kafka, RabbitMQ) spans
- Add more complex multi-service traces
- Add performance regression scenarios

---

**Status**: ✅ **Sample Data Complete and Ready to Use** 🎉
