# AI Backend with Multi-Provider LLM Support

## Architecture Overview: Cloud and Local LLM Integration

```mermaid
graph TB
    %% Frontend Layer
    subgraph "🖥️ Frontend"
        UI[Jaeger React UI<br/>Natural Language Interface]
    end
    
    %% AI Backend Layer
    subgraph "🤖 AI Backend Service"
        API[REST API Layer<br/>Query & Explain Endpoints]
        BUSINESS[Business Logic<br/>Query Translation & Span Analysis]
    end
    
    %% LLM Abstraction Layer
    subgraph "🔌 LLM Abstraction Layer"
        INTERFACE[LLM Client Interface<br/>Unified API Contract]
        FACTORY[Provider Factory<br/>Selects Implementation]
    end
    
    %% Configuration
    subgraph "⚙️ Configuration"
        CONFIG[config.yaml<br/>Provider Selection]
        ENV[Environment Variables<br/>API Keys & Settings]
    end
    
    %% LLM Providers
    subgraph "🧠 LLM Providers"
        subgraph "🏠 Local LLM (Privacy-First)"
            OLLAMA[Ollama Server<br/>localhost:11434]
            MODELS[Local Models<br/>llama3, codellama, mistral]
        end
        
        subgraph "☁️ Cloud LLMs (Optional)"
            OPENAI[OpenAI GPT-4<br/>API Client]
            ANTHROPIC[Anthropic Claude<br/>API Client]
        end
        
        MOCK[Mock Provider<br/>Development & Testing]
    end

    %% Request Flow
    UI -->|HTTP Requests Only| API
    API --> BUSINESS
    BUSINESS -->|Uses Abstraction| INTERFACE
    INTERFACE --> FACTORY
    
    %% Provider Selection (Configuration-Driven)
    CONFIG -->|provider: "ollama"| FACTORY
    CONFIG -->|provider: "openai"| FACTORY
    CONFIG -->|provider: "anthropic"| FACTORY
    ENV -->|API Keys| FACTORY
    
    %% Provider Implementations
    FACTORY -->|Local Deployment| OLLAMA
    FACTORY -.->|Cloud Option| OPENAI
    FACTORY -.->|Cloud Option| ANTHROPIC
    FACTORY -.->|Dev/Test| MOCK
    
    %% Local LLM Details
    OLLAMA --> MODELS

    %% Styling
    classDef frontend fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef backend fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef abstraction fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef config fill:#f1f8e9,stroke:#689f38,stroke-width:2px
    classDef local fill:#e0f2f1,stroke:#00796b,stroke-width:3px
    classDef cloud fill:#fff8e1,stroke:#fbc02d,stroke-width:2px
    classDef mock fill:#fce4ec,stroke:#c2185b,stroke-width:2px

    class UI frontend
    class API,BUSINESS backend
    class INTERFACE,FACTORY abstraction
    class CONFIG,ENV config
    class OLLAMA,MODELS local
    class OPENAI,ANTHROPIC cloud
    class MOCK mock
```

## Key Architecture Benefits

### 🔒 **Clean Separation of Concerns**

#### Business Logic Layer
```go
// Business logic never knows which LLM is being used
type QueryService struct {
    llmClient LLMClient  // Interface, not concrete implementation
}

func (s *QueryService) TranslateQuery(query string) (*SearchParams, error) {
    // Business logic focuses on the problem, not the LLM provider
    response, err := s.llmClient.Complete(CompletionRequest{
        Prompt: buildQueryPrompt(query),
        Temperature: 0.0,
    })
    // ... process response
}
```

#### LLM Abstraction Interface
```go
type LLMClient interface {
    Complete(request CompletionRequest) (CompletionResponse, error)
    IsConfigured() bool
    GetProvider() string
}
```

### 🏠 **Privacy-First Local Deployment**

#### Ollama Integration
```yaml
# config.yaml - Local LLM Configuration
llm:
  provider: "ollama"
  ollama:
    endpoint: "http://localhost:11434"
    model: "llama3"
    timeout: "30s"
    
# Benefits:
# ✅ Data never leaves your infrastructure
# ✅ No API costs
# ✅ No internet dependency
# ✅ Full control over model versions
```

#### Local Setup Commands
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Download and run a model
ollama pull llama3
ollama serve

# AI Backend automatically connects
```

### ☁️ **Optional Cloud Providers**

#### OpenAI Configuration
```yaml
# config.yaml - Cloud LLM Configuration
llm:
  provider: "openai"
  openai:
    model: "gpt-4"
    temperature: 0.0
    max_tokens: 500
    
# Environment variables
OPENAI_API_KEY=sk-...
```

#### Anthropic Configuration
```yaml
# config.yaml - Alternative Cloud Provider
llm:
  provider: "anthropic"
  anthropic:
    model: "claude-3-sonnet"
    temperature: 0.0
    max_tokens: 500
    
# Environment variables
ANTHROPIC_API_KEY=sk-ant-...
```

## Provider Selection Logic

### Configuration-Driven Selection
```go
func NewLLMClient(config Config) (LLMClient, error) {
    switch config.LLM.Provider {
    case "ollama":
        return NewOllamaClient(config.LLM.Ollama)
    case "openai":
        return NewOpenAIClient(config.LLM.OpenAI)
    case "anthropic":
        return NewAnthropicClient(config.LLM.Anthropic)
    case "mock":
        return NewMockClient()
    default:
        return nil, fmt.Errorf("unknown provider: %s", config.LLM.Provider)
    }
}
```

### Fallback Strategy
```go
// Graceful degradation
func NewLLMClientWithFallback(config Config) LLMClient {
    // Try primary provider
    if client, err := NewLLMClient(config); err == nil && client.IsConfigured() {
        return client
    }
    
    // Fallback to mock for development
    log.Warn("Primary LLM provider unavailable, using mock client")
    return NewMockClient()
}
```

## Deployment Scenarios

### 🏢 **Enterprise Local Deployment**
```yaml
# Maximum privacy and control
llm:
  provider: "ollama"
  ollama:
    endpoint: "http://ollama-server:11434"
    model: "llama3"

# Benefits:
# - All data stays within corporate network
# - No external API dependencies
# - Predictable costs (hardware only)
# - Custom model fine-tuning possible
```

### ☁️ **Cloud-First Deployment**
```yaml
# Maximum convenience and scalability
llm:
  provider: "openai"
  openai:
    model: "gpt-4"

# Benefits:
# - No local infrastructure required
# - Latest model capabilities
# - Unlimited scalability
# - Managed service reliability
```

### 🔄 **Hybrid Deployment**
```yaml
# Primary: Local for privacy
# Fallback: Cloud for availability
llm:
  provider: "ollama"
  fallback_provider: "openai"
  
# Use cases:
# - Local for sensitive data
# - Cloud for high-volume periods
# - Development flexibility
```

## Request Flow Examples

### Local LLM Flow
```
1. User: "show slow payments"
2. Jaeger UI → AI Backend
3. Backend → LLM Abstraction
4. Abstraction → Ollama (localhost:11434)
5. Ollama → llama3 model
6. Response: {"service": "payment", "minDuration": "500ms"}
7. Backend → Jaeger Query Service
8. Results → User
```

### Cloud LLM Flow
```
1. User: "show slow payments"
2. Jaeger UI → AI Backend
3. Backend → LLM Abstraction
4. Abstraction → OpenAI API
5. OpenAI → GPT-4 model
6. Response: {"service": "payment", "minDuration": "500ms"}
7. Backend → Jaeger Query Service
8. Results → User
```

## Configuration Examples

### Complete Local Configuration
```yaml
# config.yaml
server:
  port: 8080
  
llm:
  provider: "ollama"
  ollama:
    endpoint: "http://localhost:11434"
    model: "llama3"
    timeout: "30s"
    
jaeger:
  query_endpoint: "http://localhost:16686"
  
logging:
  level: "info"
```

### Complete Cloud Configuration
```yaml
# config.yaml
server:
  port: 8080
  
llm:
  provider: "openai"
  openai:
    model: "gpt-4"
    temperature: 0.0
    max_tokens: 500
    timeout: "10s"
    
jaeger:
  query_endpoint: "http://localhost:16686"
  
logging:
  level: "info"
```

### Environment Variables
```bash
# .env file
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-...
LOG_LEVEL=info
JAEGER_QUERY_ENDPOINT=http://jaeger:16686
```

## Provider Comparison

| Feature | **Local (Ollama)** | **Cloud (OpenAI/Anthropic)** |
|---------|-------------------|-------------------------------|
| **Privacy** | ✅ Complete data privacy | ❌ Data sent to external API |
| **Cost** | ✅ Free after setup | ❌ Pay per request |
| **Setup** | ⚠️ Requires local installation | ✅ Just API key needed |
| **Performance** | ⚠️ Depends on hardware | ✅ Consistent high performance |
| **Availability** | ⚠️ Depends on local infrastructure | ✅ Managed service uptime |
| **Customization** | ✅ Can fine-tune models | ❌ Limited to provided models |
| **Scalability** | ⚠️ Limited by hardware | ✅ Unlimited scaling |
| **Internet** | ✅ Works offline | ❌ Requires internet connection |

## Implementation Benefits

### 🔧 **Easy Provider Switching**
```bash
# Switch from cloud to local
sed -i 's/provider: "openai"/provider: "ollama"/' config.yaml

# Restart service - no code changes needed
systemctl restart jaeger-ai-backend
```

### 🧪 **Development Flexibility**
```yaml
# Development environment
llm:
  provider: "mock"  # Fast, predictable responses

# Staging environment  
llm:
  provider: "ollama"  # Test with real AI, no costs

# Production environment
llm:
  provider: "openai"  # Maximum reliability
```

### 🔒 **Security Compliance**
```yaml
# For regulated industries
llm:
  provider: "ollama"  # Data never leaves premises
  
# For general use
llm:
  provider: "openai"  # Leverage managed service
```

---

**This architecture provides maximum flexibility while maintaining clean separation of concerns, enabling teams to choose the LLM deployment strategy that best fits their privacy, cost, and performance requirements.**