# Explain Span/Trace Feature - Step-by-Step Flow

## How AI Transforms Raw Telemetry into Human Insights

```mermaid
graph TD
    %% Step 1: User Selection
    USER[👤 User]
    SELECT[🎯 Selects Span/Trace<br/>in Jaeger UI]
    
    %% Step 2: Explain Button
    BUTTON[🔘 Clicks "Explain"<br/>Button]
    
    %% Step 3: UI Action
    UI[🖥️ Jaeger UI<br/>Prepares Request]
    
    %% Step 4: Send Data
    SEND[📤 Sends Telemetry Data<br/>to AI Backend]
    
    %% Step 5: Backend Analysis
    BACKEND[🤖 AI Backend<br/>Receives Raw Data]
    
    %% Step 6: Data Processing
    ANALYZE[🔍 Analyzes Telemetry<br/>Tags, Logs, Duration, Relations]
    
    %% Step 7: AI Processing
    LLM[🧠 Language Model<br/>Generates Explanation]
    
    %% Step 8: Human Explanation
    EXPLANATION[📝 Creates Human-Readable<br/>Summary & Insights]
    
    %% Step 9: Return Response
    RETURN[📥 Returns Explanation<br/>to UI]
    
    %% Step 10: Display
    DISPLAY[✨ UI Shows Explanation<br/>Next to Span/Trace]

    %% Flow connections
    USER --> SELECT
    SELECT --> BUTTON
    BUTTON --> UI
    UI -->|"1. Send span metadata"| SEND
    SEND --> BACKEND
    BACKEND -->|"2. Process raw telemetry"| ANALYZE
    ANALYZE -->|"3. Send to AI"| LLM
    LLM -->|"4. Generate insights"| EXPLANATION
    EXPLANATION -->|"5. Return summary"| RETURN
    RETURN -->|"6. Display explanation"| DISPLAY
    DISPLAY --> USER

    %% Styling
    classDef user fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef ui fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef backend fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef analysis fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef ai fill:#fff8e1,stroke:#fbc02d,stroke-width:2px
    classDef output fill:#e0f2f1,stroke:#00796b,stroke-width:2px

    class USER,SELECT,BUTTON,DISPLAY user
    class UI,SEND,RETURN ui
    class BACKEND backend
    class ANALYZE analysis
    class LLM,EXPLANATION ai
    class DISPLAY output
```

## Raw Data → Human Insight Transformation

### 📊 What the AI Receives (Raw Telemetry)
```json
{
  "spanID": "abc123",
  "traceID": "xyz789",
  "operationName": "POST /api/payment/process",
  "duration": 1250000,
  "tags": {
    "http.method": "POST",
    "http.status_code": 200,
    "http.url": "/api/payment/process",
    "span.kind": "server",
    "component": "payment-service"
  },
  "logs": [
    {
      "timestamp": 1640995200000,
      "fields": {
        "event": "payment.validation.start"
      }
    },
    {
      "timestamp": 1640995201000,
      "fields": {
        "event": "payment.processing.complete",
        "amount": 99.99,
        "currency": "USD"
      }
    }
  ]
}
```

### 🧠 What the AI Understands
```
Analysis Process:
✓ Operation: HTTP POST request to payment endpoint
✓ Duration: 1.25 seconds (potentially slow)
✓ Status: Successful (HTTP 200)
✓ Service: Payment processing service
✓ Business Logic: Payment validation and processing
✓ Performance: Above normal threshold
```

### 📝 What the User Gets (Human Explanation)
```
💳 Payment Processing Request

Summary: This span represents a successful payment processing request 
that took 1.25 seconds to complete.

🔍 What Happened:
• HTTP POST request to /api/payment/process
• Payment validation started
• Successfully processed $99.99 USD payment
• Returned HTTP 200 (success)

⚡ Performance Analysis:
• Duration: 1.25 seconds (SLOW - above 500ms threshold)
• Status: Completed successfully
• Recommendation: Monitor for performance optimization

🏷️ Technical Details:
• Service: payment-service
• Span Type: Server-side HTTP request
• Trace ID: xyz789 (part of larger request flow)
```

## Step-by-Step Breakdown

### Step 1: 🎯 User Selects Span/Trace
```
Action: User clicks on a span in the trace timeline
Context: Span contains raw telemetry data
```

### Step 2: 🔘 User Clicks "Explain"
```
UI Element: "Explain" button appears near selected span
Action: Triggers explanation request
```

### Step 3: 🖥️ Jaeger UI Prepares Request
```
Data Collection: Gathers span metadata, tags, logs
Format: Structures data for API call
```

### Step 4: 📤 Sends Telemetry to AI Backend
```
API Call: POST /api/explain
Payload: Complete span data with context
```

### Step 5: 🤖 AI Backend Receives Data
```
Processing: Validates and prepares telemetry data
Context: Adds any additional trace context if needed
```

### Step 6: 🔍 Analyzes Telemetry Components
```
Tags Analysis: HTTP method, status, service name
Logs Analysis: Business events and timestamps
Duration Analysis: Performance characteristics
Relationships: Parent/child span connections
```

### Step 7: 🧠 Language Model Processing
```
AI Task: Convert technical data into human language
Context: Apply domain knowledge about distributed systems
Output: Structured explanation with insights
```

### Step 8: 📝 Creates Human-Readable Summary
```
Components:
• Plain English summary
• Performance analysis
• Business context
• Technical recommendations
```

### Step 9: 📥 Returns to UI
```
Response: Formatted explanation text
Format: Structured for display in UI
```

### Step 10: ✨ UI Displays Explanation
```
Location: Tooltip, sidebar, or modal next to span
Content: Human-readable insights about the span
```

## Types of Explanations Generated

### 🌐 HTTP Request Spans
```
Input: HTTP tags, status codes, URLs
Output: "GET request to user profile API, 45ms, successful"
```

### 🗄️ Database Query Spans
```
Input: Database tags, query info, duration
Output: "SELECT query on users table, 120ms, returned 15 rows"
```

### 🔄 Service-to-Service Calls
```
Input: Client span tags, service names
Output: "Call from frontend to payment service, 200ms, successful"
```

### ❌ Error Spans
```
Input: Error tags, exception logs
Output: "Database connection failed, timeout after 5 seconds, needs retry"
```

### 🔀 Complex Business Operations
```
Input: Multiple logs, business events
Output: "Order processing: validation → payment → inventory → confirmation"
```

## What Makes the Explanations Valuable

### 🎯 **Context-Aware**
- Understands business operations from technical data
- Explains "why" not just "what"
- Provides actionable insights

### 📊 **Performance Insights**
- Identifies slow operations automatically
- Compares against normal thresholds
- Suggests optimization opportunities

### 🔍 **Error Analysis**
- Explains what went wrong in plain English
- Suggests potential causes and solutions
- Helps with faster debugging

### 🏢 **Business Translation**
- Converts technical spans into business terms
- Helps non-technical team members understand traces
- Bridges the gap between ops and business teams

## Example Transformations

### Before (Raw Data)
```
operationName: "db.query"
duration: 2500000
tags: {
  "db.statement": "SELECT * FROM orders WHERE status = 'pending'",
  "db.type": "postgresql",
  "error": "true"
}
logs: [
  {"level": "error", "message": "connection timeout"}
]
```

### After (Human Explanation)
```
🗄️ Database Query Failed

Summary: A database query to find pending orders failed due to a 
connection timeout after 2.5 seconds.

❌ What Went Wrong:
• Query: Looking for pending orders in PostgreSQL
• Error: Database connection timed out
• Duration: 2.5 seconds (very slow)

🔧 Recommendations:
• Check database connection pool settings
• Monitor database server health
• Consider query optimization
• Implement retry logic for timeouts
```

---

**This feature makes distributed tracing accessible to everyone by translating complex telemetry data into clear, actionable insights.**