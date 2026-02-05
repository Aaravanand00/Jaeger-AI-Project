# Explain Span Feature - Implementation Summary

## ✅ Feature Complete

The **Explain Span** feature is fully implemented and functional.

---

## **What Was Built**

This feature is implemented as a backend API and does not include a UI.
It is designed to be integrated into the Jaeger UI in a later stage.

### **1. Span Schema** (`src/schemas/jaeger/span.schema.ts`)
Defines the complete Jaeger span structure:
```typescript
interface JaegerSpan {
  spanID: string;
  traceID: string;
  operationName: string;
  serviceName: string;
  startTime: number;        // microseconds since epoch
  duration: number;         // microseconds
  tags: SpanTag[];
  logs?: SpanLog[];
  references?: SpanReference[];
  process?: ProcessInfo;
}
```

**Helper Functions:**
- `getTagValue()` - Extract tag by key
- `hasError()` - Detect errors from tags
- `formatDuration()` - Human-readable duration
- `isValidSpan()` - Validate span structure

### **2. Strict Prompt** (`src/prompts/explain.prompt.ts`)
Enforces structured, technical summaries:

**Rules:**
- ❌ No assumptions
- ❌ No guessing missing data
- ❌ No hallucination
- ✅ Only summarize provided data
- ✅ Technical and concise
- ✅ JSON-only output

**Output Schema:**
```typescript
interface ExplanationResult {
  summary: string;              // 1-2 sentence technical description
  spanType: string;             // HTTP Client, Database Query, etc.
  performance: {
    duration: string;
    assessment: 'fast' | 'normal' | 'slow' | 'critical'
  };
  errorInfo: {
    hasError: boolean;
    errorType: string | null;
    errorMessage: string | null;
  } | null;
  keyDetails: string[];         // Important technical details
}
```

### **3. Enhanced Mock LLM** (`src/clients/llm/mock.client.ts`)
Extended to handle span explanations:

**Features:**
- Auto-detects span type (HTTP, Database, RPC, gRPC)
- Assesses performance based on span type
- Extracts error information from tags and logs
- Generates technical summaries
- Pattern-based analysis (no LLM API needed)

**Performance Thresholds:**
- **HTTP**: fast <100ms, normal 100-500ms, slow 500ms-2s, critical >2s
- **Database**: fast <50ms, normal 50-200ms, slow 200ms-1s, critical >1s
- **RPC/gRPC**: fast <50ms, normal 50-300ms, slow 300ms-1s, critical >1s

### **4. Explain Service** (`src/services/explain.service.ts`)
Business logic layer:
- Validates span structure
- Builds prompts
- Calls LLM client
- Parses JSON responses
- Handles errors

### **5. Explain Controller** (`src/api/controllers/explain.controller.ts`)
HTTP handler for `POST /api/explain`

---

## **Live Example**

### **Input:**
```json
POST /api/explain
{
  "span": {
    "spanID": "abc123",
    "traceID": "trace-456",
    "operationName": "HTTP GET /api/users",
    "serviceName": "frontend-service",
    "startTime": 1675234567000000,
    "duration": 45000,
    "tags": [
      { "key": "http.method", "value": "GET" },
      { "key": "http.status_code", "value": 200 },
      { "key": "span.kind", "value": "client" }
    ]
  }
}
```

### **Output:**
```json
{
  "success": true,
  "data": {
    "explanation": {
      "summary": "HTTP Client: HTTP GET /api/users from frontend-service, completed successfully",
      "spanType": "HTTP Client",
      "performance": {
        "duration": "45.00ms",
        "assessment": "fast"
      },
      "errorInfo": null,
      "keyDetails": [
        "http.method: GET",
        "http.status_code: 200",
        "Span kind: client",
        "Service: frontend-service"
      ]
    },
    "spanContext": {
      "spanID": "abc123",
      "traceID": "trace-456"
    },
    "metadata": {
      "provider": "mock",
      "processingTimeMs": 1
    }
  }
}
```

---

## **Test Examples**

### **1. Normal HTTP Request**
- **Duration**: 45ms → **fast**
- **Status**: 200 → no error
- **Summary**: Technical, concise, based only on provided tags

These tests act as API clients and demonstrate expected behavior.
They are not unit tests but functional verification scripts.

### **2. Slow Database Query**
```javascript
{
  operationName: "SELECT * FROM users WHERE id = ?",
  duration: 850000,  // 850ms
  tags: [
    { key: "db.type", value: "postgres" },
    { key: "db.statement", value: "SELECT * FROM users WHERE id = $1" }
  ]
}
```
**Output:**
- **Span Type**: Database Query
- **Performance**: 850ms → **slow**
- **Assessment**: Flags performance issue without assumptions

### **3. HTTP Error**
```javascript
{
  operationName: "HTTP POST /api/payment",
  duration: 125000,
  tags: [
    { key: "http.method", value: "POST" },
    { key: "http.status_code", value: 500 },
    { key: "error", value: true }
  ],
  logs: [
    {
      fields: [
        { key: "message", value: "Database connection timeout" }
      ]
    }
  ]
}
```
**Output:**
- **Error Info**: { hasError: true, errorType: "HTTP 500", errorMessage: "Database connection timeout" }
- **Summary**: Includes error context from logs

---

## **Design Principles Achieved**

✅ **No Assumptions**: Only analyzes provided data  
✅ **No Guessing**: Missing fields → null or empty array  
✅ **Technical**: Uses OpenTelemetry/Jaeger terminology  
✅ **Concise**: 1-2 sentence summaries  
✅ **Structured**: JSON-only output  
✅ **Performance-aware**: Context-specific thresholds  

---

## **Architecture Flow**

```
POST /api/explain
      ↓
[explain.controller.ts]
      ↓
Validate span structure
      ↓
[explain.service.ts]
      ↓
Build prompt with span data
      ↓
[mock.client.ts]
      ↓
Analyze span:
  - Detect type (HTTP/DB/RPC)
  - Assess performance
  - Extract errors
  - Generate summary
      ↓
Return ExplanationResult
```

---

## **Files Created**

```
src/
├── schemas/jaeger/
│   └── span.schema.ts                 ✅ Span types & helpers
├── prompts/
│   └── explain.prompt.ts              ✅ Strict explanation prompt
├── services/
│   └── explain.service.ts             ✅ Business logic
├── clients/llm/
│   └── mock.client.ts                 ✅ Enhanced with span analysis
└── api/controllers/
    └── explain.controller.ts          ✅ HTTP handler (updated)

Tests:
├── test-explain.js                    ✅ Full test suite
└── simple-explain-test.js             ✅ Simple demo
```

---

## **How to Test**

### **Start server** (if not running):
```bash
npm run dev
```

### **Run simple test:**
```bash
node simple-explain-test.js
```

### **Run full test suite:**
```bash
node test-explain.js
```

### **Manual test (PowerShell):**
```powershell
$span = @{
  spanID = "test-123"
  traceID = "trace-456"
  operationName = "HTTP GET /api/users"
  serviceName = "frontend"
  startTime = 1675234567000000
  duration = 45000
  tags = @(
    @{ key = "http.method"; value = "GET" }
    @{ key = "http.status_code"; value = 200 }
  )
} | ConvertTo-Json -Depth 10

$body = @{ span = $span | ConvertFrom-Json } | ConvertTo-Json -Depth 10

Invoke-WebRequest -Uri http://localhost:3000/api/explain `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body `
  -UseBasicParsing
```

---

## **Success Criteria Met**

✅ Input span structure defined (with helpers)  
✅ Prompt summarizes only provided data  
✅ POST /explain handler implemented  
✅ No assumptions or hallucinations  
✅ Short, technical summaries  
✅ Tested and functional  

---

**Status**: Feature complete and production-ready from an API and architecture standpoint (LLM client currently mocked).
