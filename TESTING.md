# Testing the Natural Language → Jaeger Search Feature

## Quick Start

### 1. Start the server
```bash
npm run dev
```

Server will start on `http://localhost:3000`

### 2. Test with curl

```bash
# Example 1: Slow requests
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "show me slow requests in payment service"}'

# Example 2: Errors
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "errors in user-api from the last hour"}'

# Example 3: Database queries
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "database calls taking more than 500ms"}'
```

### 3. Run the test script
```bash
node test-query.js
```

## Expected Output

### Input:
```json
{
  "query": "show me slow requests in payment service"
}
```

### Output:
```json
{
  "success": true,
  "data": {
    "params": {
      "service": "payment-service",
      "operation": null,
      "tags": {},
      "minDuration": "500ms",
      "maxDuration": null,
      "lookback": "1h",
      "limit": 20
    },
    "originalQuery": "show me slow requests in payment service",
    "metadata": {
      "provider": "mock",
      "processingTimeMs": 5
    }
  }
}
```

## Query Examples

| Natural Language Query | Extracted Service | Tags | Duration Filter |
|------------------------|-------------------|------|-----------------|
| "slow requests in payment service" | payment-service | {} | minDuration: "500ms" |
| "errors in user-api" | user-api | {"error": "true"} | null |
| "database calls taking more than 500ms" | database | {"db.type": "postgres"} | minDuration: "500ms" |
| "GET requests to frontend that failed" | frontend | {"error": "true"} | null |
| "POST requests in auth-service from last 24h" | auth-service | {} | null |

## Architecture

```
User Query → Controller → Service → LLM Client → Prompt
                                       ↓
                                   Mock/OpenAI
                                       ↓
                                  JSON Response
                                       ↓
                                   Validation
                                       ↓
                              Jaeger Search Params
```

## Files Created

1. **`src/schemas/jaeger/search-params.schema.ts`**
   - TypeScript interface for Jaeger search parameters
   - Validation functions
   - Default values

2. **`src/prompts/query.prompt.ts`**
   - Strict prompt template enforcing JSON-only output
   - Examples for few-shot learning
   - System instructions

3. **`src/clients/llm/llm.client.interface.ts`**
   - Abstract interface for LLM providers
   - Enables swapping OpenAI/Anthropic/local models

4. **`src/clients/llm/mock.client.ts`**
   - Rule-based pattern matching for demo
   - No API keys required
   - Simulates LLM understanding

5. **`src/services/query.service.ts`**
   - Business logic layer
   - Orchestrates LLM calls
   - Parses and validates JSON responses

6. **`src/api/controllers/query.controller.ts`**
   - HTTP request handling
   - Input validation
   - Response formatting

## Next Steps

To use a real LLM (OpenAI):

1. Create `src/clients/llm/openai.client.ts`
2. Add your API key to `.env`
3. Swap `MockLLMClient` with `OpenAIClient` in `query.controller.ts`

```typescript
// In query.controller.ts
import { OpenAIClient } from '../../clients/llm/openai.client';
const llmClient = new OpenAIClient();
```
