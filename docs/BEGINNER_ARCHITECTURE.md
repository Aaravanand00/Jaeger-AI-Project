# AI-Powered Trace Analysis in Jaeger - Architecture Overview

## Simple Architecture Flowchart

```mermaid
graph TB
    %% User and Frontend
    USER[👤 User<br/>Types: "show slow payments"]
    
    %% Layer 1: Frontend
    subgraph "🖥️ Frontend Layer"
        UI[Jaeger React UI<br/>Web Interface]
    end
    
    %% Layer 2: AI Backend
    subgraph "🤖 AI Backend Service (Go + LangChainGo)"
        BACKEND[AI Backend<br/>Processes Requests]
    end
    
    %% Layer 3: LLM Abstraction
    subgraph "🔌 LLM Abstraction Layer"
        ABSTRACTION[LLM Interface<br/>Chooses AI Provider]
    end
    
    %% Layer 4: LLM Providers
    subgraph "🧠 AI Providers"
        subgraph "☁️ Cloud LLMs"
            OPENAI[OpenAI GPT-4]
            CLAUDE[Anthropic Claude]
        end
        
        subgraph "🏠 Local LLM (Private)"
            OLLAMA[Ollama Server<br/>Runs on Your Machine]
            MODELS[Local AI Models<br/>llama3, codellama]
        end
    end
    
    %% Layer 5: Jaeger Services
    subgraph "🔍 Jaeger Query Service"
        JAEGER[Jaeger API<br/>Searches Traces]
        STORAGE[(Trace Database<br/>Your Trace Data)]
    end

    %% Main Flow - Natural Language Query
    USER -->|1. "show slow payments"| UI
    UI -->|2. Send query| BACKEND
    BACKEND -->|3. Ask AI to interpret| ABSTRACTION
    
    %% AI Provider Selection (Configurable)
    ABSTRACTION -.->|Option A: Cloud| OPENAI
    ABSTRACTION -.->|Option A: Cloud| CLAUDE
    ABSTRACTION -->|Option B: Local<br/>(Private & Free)| OLLAMA
    OLLAMA --> MODELS
    
    %% Response Flow
    ABSTRACTION -->|4. AI Response:<br/>service=payment<br/>minDuration=500ms| BACKEND
    BACKEND -->|5. Search with<br/>structured params| JAEGER
    JAEGER -->|6. Query database| STORAGE
    STORAGE -->|7. Return traces| JAEGER
    JAEGER -->|8. Trace results| BACKEND
    BACKEND -->|9. Final results| UI
    UI -->|10. Show traces| USER

    %% Configuration
    CONFIG[⚙️ Configuration<br/>Choose: Local or Cloud AI]
    CONFIG -.->|Controls which AI to use| ABSTRACTION

    %% Styling for clarity
    classDef user fill:#e3f2fd,stroke:#1976d2,stroke-width:3px
    classDef frontend fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef backend fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef abstraction fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef cloud fill:#fff8e1,stroke:#fbc02d,stroke-width:2px
    classDef local fill:#e0f2f1,stroke:#00796b,stroke-width:2px
    classDef jaeger fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    classDef config fill:#f1f8e9,stroke:#689f38,stroke-width:2px

    class USER user
    class UI frontend
    class BACKEND backend
    class ABSTRACTION abstraction
    class OPENAI,CLAUDE cloud
    class OLLAMA,MODELS local
    class JAEGER,STORAGE jaeger
    class CONFIG config
```

## How It Works (Step by Step)

### 🔄 Natural Language Query Flow

```
👤 User Types: "show me slow payment requests"
    ↓
🖥️ Jaeger UI: Sends query to AI backend
    ↓
🤖 AI Backend: "I need to understand this query"
    ↓
🔌 LLM Abstraction: Chooses AI provider (Local or Cloud)
    ↓
🧠 AI Provider: Interprets query → Returns structured search
    ↓
🤖 AI Backend: Gets structured params like:
   {
     "service": "payment",
     "minDuration": "500ms",
     "tags": {"http.status_code": "200"}
   }
    ↓
🔍 Jaeger Query: Searches traces with these parameters
    ↓
🖥️ Jaeger UI: Shows filtered trace results to user
```

### 🏠 Local LLM vs ☁️ Cloud LLM

| **Local LLM (Ollama)** | **Cloud LLM (OpenAI/Claude)** |
|-------------------------|--------------------------------|
| ✅ **Private**: Data stays on your machine | ❌ **Public**: Data sent to external API |
| ✅ **Free**: No API costs | ❌ **Paid**: Costs per request |
| ✅ **Fast**: No network latency | ⚠️ **Network**: Depends on internet |
| ⚠️ **Setup**: Requires local installation | ✅ **Easy**: Just need API key |
| ⚠️ **Resources**: Uses your CPU/GPU | ✅ **Scalable**: Unlimited capacity |

### ⚙️ Configuration Example

**Choose Local LLM:**
```yaml
# config.yaml
llm:
  provider: "ollama"    # Use local AI
  model: "llama3"       # Which local model
```

**Choose Cloud LLM:**
```yaml
# config.yaml
llm:
  provider: "openai"    # Use cloud AI
  model: "gpt-4"        # Which cloud model
```

## Real-World Example

### Input: Natural Language
```
User types: "find slow database calls in the checkout service from the last hour"
```

### AI Processing
The AI understands this means:
- **Service**: `checkout`
- **Operation**: `database` or `db`
- **Performance**: `slow` (duration > 500ms)
- **Time Range**: `last hour`

### Output: Structured Search
```json
{
  "service": "checkout",
  "operation": "db",
  "minDuration": "500ms",
  "lookback": "1h",
  "tags": {
    "span.kind": "client",
    "db.type": "*"
  }
}
```

### Result: Filtered Traces
Jaeger returns only the traces that match these exact criteria, making it easy to find the slow database calls you're looking for.

## Why This Architecture?

### 🎯 **Simple for Users**
- Type questions in plain English
- No need to learn Jaeger query syntax
- Get exactly what you're looking for

### 🔧 **Flexible for Teams**
- Choose local AI for privacy
- Choose cloud AI for convenience
- Switch between providers easily

### 🏗️ **Clean Architecture**
- Each layer has one job
- Easy to test and maintain
- Can swap components independently

### 🚀 **Production Ready**
- Handles errors gracefully
- Scales with your team
- Integrates with existing Jaeger setup

---

**This architecture makes distributed tracing accessible to everyone on your team, regardless of their Jaeger expertise level.**