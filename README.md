# Jaeger AI Query Service - Beginner's Guide

> ⚠️ **Important**: This is a **backend API service ONLY**. There is **NO web user interface (UI)** in this repository.  
> This is a **functional prototype** for demonstration purposes, not production software.

---

## What This Service Does (Simple Explanation)

This is a **backend service** that provides two AI-powered features for Jaeger (a distributed tracing tool):

1. **Translate Questions → Search Filters**
   - You ask: "show me slow requests in payment service"
   - Service converts it to: `{service: "payment", minDuration: "500ms"}`

2. **Explain Traces**
   - You give it trace span data (tags, logs, duration)
   - Service gives you: "HTTP GET request, 45ms, completed successfully"

**Note**: This service uses **simulated/mock data** for demonstration. It's not connected to a real Jaeger backend or real AI.

---

## ⚠️ VERY IMPORTANT: This is an API, Not a Website

### What This Means for Beginners

If you've only used websites before, this might be confusing. Let me explain:

#### ❌ **What This Service Does NOT Have**
- No web pages you can click around on
- No forms to fill out
- No buttons to press
- No visual interface in your browser

#### ✅ **What This Service DOES Have**
- **API endpoints** - special web addresses that accept data and return results
- Results appear in **JSON format** (structured text data)
- You interact with it using **commands in the terminal** (not a web browser)

#### 🤔 **Why Is It Built This Way?**
Because this backend service will eventually be **integrated into Jaeger's existing React UI**.  
The UI will live inside Jaeger, not in this repository.

This repo focuses **only** on the backend logic.

---

## Browser vs Terminal: Where Things Appear

**This is the most confusing part for beginners. Read carefully!**

### What You Will See in Your Browser

| URL | What You See | Is This Normal? |
|-----|--------------|-----------------|
| `http://localhost:3000/` | JSON message saying "This is an API-only service" | ✅ **Yes! Expected!** |
| `http://localhost:3000/health` | `{"status": "healthy", ...}` | ✅ **Yes! Server is working!** |
| `http://localhost:3000/anything-else` | "Cannot GET /anything-else" | ✅ **Yes! That route doesn't exist** |

**Why does it look "empty" or "broken"?**  
Because there's no web page design! This is an **API**, not a website.  
The JSON text you see IS the correct response.

### What You Will See in Your Terminal

| Terminal | What Appears | Why |
|----------|--------------|-----|
| **Terminal 1** (running `npm run dev`) | Server logs, requests received | This shows the server is working |
| **Terminal 2** (where you run tests) | **Query results and answers** | **This is where the AI responses appear!** |

**Key Point**: The **answers to your questions appear in Terminal 2**, not in the browser!

---

## How Many Terminals Do You Need?

**You need TWO terminals open at the same time.**

This is normal for backend development. Here's why:

### Terminal 1: The Server
- **Purpose**: Runs the backend service
- **Command**: `npm run dev`
- **Stays open**: YES - leave this running the whole time
- **What you see**: Server startup message, then logs

### Terminal 2: Asking Questions
- **Purpose**: Send requests to the server and see responses
- **Commands**: `node simple-test.js` or PowerShell commands
- **Stays open**: NO - you run commands and see results
- **What you see**: **The actual AI responses / query results**

**Visual Guide**:
```
Terminal 1 (Server)          Terminal 2 (Your Commands)
├─ npm run dev              ├─ node simple-test.js
├─ Server started ✓         ├─ {
├─ Listening on :3000       │    "service": "payment",
├─ (stays running)          │    "minDuration": "500ms"
├─ ...                      │  }
└─ (don't close this!)      └─ (results appear here!)
```

---

## Step-by-Step: Running Locally

### Requirements
- **Node.js 18 or newer** (download from [nodejs.org](https://nodejs.org))
- **npm** (comes with Node.js)
- **Windows PowerShell** / **macOS Terminal** / **Linux Terminal**

### Step 1: Install Dependencies

Open a terminal and run:

```bash
cd "d:\OneDrive\Desktop\Jaeger Project\jaeger-ai-query-service"
npm install
```

This installs all required packages. You only do this once.

### Step 2: Start the Server (Terminal 1)

In the **same terminal**, run:

```bash
npm run dev
```

**What success looks like**:
```
🚀 Server started successfully
📍 Listening on: http://localhost:3000
🌍 Environment: development

📌 Available Endpoints:
  POST   http://localhost:3000/api/search   - Natural language → Jaeger params
  POST   http://localhost:3000/api/explain  - Span → Technical summary
  GET    http://localhost:3000/health       - Health check

✅ Ready to accept requests!
```

**Leave this terminal open!** The server is now running.

### Step 3: Verify Server is Running

**Option A: Use Your Browser**

Open this URL in any web browser:
```
http://localhost:3000/health
```

You should see:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-06T01:15:23.456Z",
  "service": "jaeger-ai-query-service"
}
```

If you see this, **the server is working correctly!** ✅

**Option B: Use Terminal (Terminal 2)**

Open a **NEW terminal** (keep Terminal 1 running!) and run:

**Windows PowerShell:**
```powershell
Invoke-WebRequest -Uri http://localhost:3000/health -UseBasicParsing | Select-Object -ExpandProperty Content
```

**macOS / Linux:**
```bash
curl http://localhost:3000/health
```

### Step 4: Run a Test Question (Terminal 2)

In your **second terminal**, run:

```bash
node simple-test.js
```

**What you'll see** (in Terminal 2):
```json
{
  "success": true,
  "data": {
    "params": {
      "service": "payment",
      "minDuration": "500ms",
      "tags": {"span.kind": "client"},
      "lookback": "1h",
      "limit": 20
    },
    "originalQuery": "show me slow requests in payment service"
  }
}
```

**This is the AI's response!** It translated your question into structured search parameters.

---

## Where Do Results Appear? (NO CONFUSION TABLE)

| Location | What You See | Example |
|----------|--------------|---------|
| **Browser: `localhost:3000/`** | JSON message | `"This is an API-only service"` |
| **Browser: `localhost:3000/health`** | Server health status | `{"status": "healthy"}` |
| **Browser: `localhost:3000/api/search`** | Error (wrong method) | Browser can't send POST requests easily |
| **Terminal 1** (server) | Server logs | `[INFO] 🚀 Server started` |
| **Terminal 2** (tests) | **AI responses / query results** | **← ANSWERS APPEAR HERE!** |
| **`node simple-test.js`** | Query translation result | JSON with search parameters |
| **`node simple-explain-test.js`** | Span explanation | Technical summary of trace |

**Remember**: **Answers appear in Terminal 2**, not in the browser!

---

## How to Ask Questions

Since this is an API, you don't type questions into a browser. You send them using **commands**.

### Method 1: Use the Test Scripts (Easiest)

**Ask a natural language question:**
```bash
node simple-test.js
```

**Get a span explained:**
```bash
node simple-explain-test.js
```

### Method 2: Use PowerShell (Windows)

**Ask your own question:**
```powershell
$query = @{query = "show me errors in checkout service"} | ConvertTo-Json
Invoke-WebRequest `
  -Uri http://localhost:3000/api/search `
  -Method POST `
  -Body $query `
  -ContentType "application/json" `
  -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Method 3: Use curl (macOS / Linux)

**Ask your own question:**
```bash
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "show me errors in checkout service"}'
```

**The response appears in your terminal!**

---

## Example Questions You Can Ask

Here are questions the service understands:

| Question | What the Service Extracts |
|----------|---------------------------|
| `"show slow requests in payment service"` | service=payment, minDuration=500ms |
| `"find errors in checkout service"` | service=checkout, tags={error: true} |
| `"show slow database calls"` | operation=database, minDuration=500ms |
| `"GET requests in frontend service"` | service=frontend, tags={http.method: GET} |
| `"requests from last hour"` | lookback=1h |

---

## Why There Is No UI Yet (And That's Okay)

### Where the UI Will Live (Future)
The user interface for this service will be **built into Jaeger's React UI**.

When someone uses the official Jaeger tracing tool, they'll see a search bar where they can:
1. Type a natural language question
2. Get AI-generated search filters
3. Click on a trace span
4. See an AI-generated explanation

### What This Repository Contains (Now)
This repository contains **only the backend logic**:
- The code that translates questions
- The code that explains spans
- The API endpoints
- Mock LLM responses

**This is intentional design**, not missing work!

### Why Separate the Backend?
- **Separation of concerns**: Backend logic stays independent
- **Easier testing**: Can test AI logic without dealing with UI
- **Flexibility**: Different UIs can use the same backend
- **Standard practice**: Real-world systems work this way

---

## Common Beginner Questions (FAQ)

### ❓ "Why does `localhost:3000` look empty / broken?"

**Answer**: It's not broken! This is an **API service**, not a website.

What you're seeing (JSON text) IS the correct response. APIs return data in JSON format, not HTML web pages.

Try opening `http://localhost:3000/health` - if you see `{"status": "healthy"}`, everything is working perfectly!

---

### ❓ "Where do I type my questions?"

**Answer**: You don't type them in a browser. You run **commands in Terminal 2**.

Use the test scripts:
```bash
node simple-test.js
```

Or use PowerShell/curl commands (see "How to Ask Questions" section above).

---

### ❓ "Why am I using the terminal instead of a website?"

**Answer**: Because you're interacting with a **backend API**, not a frontend website.

Think of it like this:
- **Website**: Made for humans to click and read
- **API**: Made for programs to exchange data
- **This service**: An API that will eventually connect to Jaeger's UI

Real developers test backend APIs using terminal commands exactly like you're doing!

---

### ❓ "Is this how real backend systems work?"

**Answer**: Yes! Exactly!

Most backend services in production:
1. Run on a server (your Terminal 1)
2. Accept requests via API endpoints
3. Return JSON responses
4. Don't have their own UI
5. Are tested using command-line tools

You're learning real backend development practices!

---

### ❓ "Do I need two terminals open forever?"

**Answer**: Only while you're using the service.

- **Terminal 1** (server): Keep open while testing
- **Terminal 2** (commands): Use when you want to ask questions

When you're done, stop the server like this:

1️⃣ **First try (all platforms)**  
In **Terminal 1 (the one running `npm run dev`)**, press: CTRL + C


2️⃣ **If the server is still running (port 3000 still active)**  
Use the command for your operating system:

**Windows (PowerShell)**
```powershell
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue |
ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }

macOS

lsof -ti :3000 | xargs kill -9

Linux

sudo lsof -ti :3000 | xargs sudo kill -9

---

### ❓ "Can I use this on Windows / Mac / Linux?"

**Answer**: Yes! All three are supported.

The only difference is the command syntax:
- **Windows**: Use PowerShell (see examples above)
- **macOS/Linux**: Use bash/terminal (see examples above)

The service itself works identically on all platforms.

---

## Supported Platforms

| Platform | Terminal | Command Example |
|----------|----------|-----------------|
| **Windows 10/11** | PowerShell | `Invoke-WebRequest -Uri http://localhost:3000/health` |
| **macOS** | Terminal | `curl http://localhost:3000/health` |
| **Linux** | Terminal | `curl http://localhost:3000/health` |

No platform-specific limitations. Works everywhere Node.js runs.

---

## Project Structure (What's Where)

```
jaeger-ai-query-service/
├── src/                      # Source code (backend logic)
│   ├── api/                 # API routes and controllers
│   ├── services/            # Business logic (AI features)
│   ├── clients/llm/         # Mock LLM client
│   ├── schemas/             # Data structures (TypeScript)
│   └── prompts/             # AI prompts
│
├── sample-data/             # 32+ fake example spans
│   ├── http-spans.ts       # HTTP request examples
│   ├── database-spans.ts   # Database query examples
│   └── complete-traces.ts  # Full trace examples
│
├── simple-test.js           # Quick test: Ask a question
├── simple-explain-test.js   # Quick test: Explain a span
├── test-query.js            # Full test suite: Queries
├── test-explain.js          # Full test suite: Explanations
│
├── README.md                # This file!
└── package.json             # Node.js project info
```

---

## Honest Scope Limitations

This prototype does **NOT** include:

❌ **Real AI/LLM** - Uses pattern matching to simulate AI responses  
❌ **Real Jaeger Backend** - Not connected to actual Jaeger servers  
❌ **User Authentication** - No login or security features  
❌ **Web UI** - No graphical interface (intentionally)  
❌ **Production Features** - No scaling, monitoring, databases  

---

## What Happens When You Stop the Server

When you press **Ctrl+C** in Terminal 1:

1. ✅ Server stops gracefully
2. ✅ Port 3000 becomes free
3. ✅ `http://localhost:3000` stops working
4. ✅ This is normal and expected

To start again:
```bash
npm run dev
```

---

## Quick Command Reference

| What You Want | Command |
|---------------|---------|
| **Start server** | `npm run dev` |
| **Stop server** | Press `Ctrl+C` in Terminal 1 |
| **Check if running** | Open `http://localhost:3000/health` in browser |
| **Ask a question** | `node simple-test.js` |
| **Explain a span** | `node simple-explain-test.js` |
| **Full tests** | `node test-query.js` or `node test-explain.js` |

---

## Troubleshooting

### "Port 3000 already in use"

**Cause**: Server is already running (or another program is using port 3000)

**Fix**:
```powershell
# Find what's using port 3000
Get-NetTCPConnection -LocalPort 3000

# Kill the process (replace 12345 with actual process ID)
Stop-Process -Id 12345 -Force
```

### "Cannot find module"

**Cause**: Dependencies not installed

**Fix**:
```bash
npm install
```

### "Command not found: node"

**Cause**: Node.js not installed

**Fix**: Download and install from [nodejs.org](https://nodejs.org)

---

## Next Steps

After you've successfully run the service:

1. ✅ Run `node simple-test.js` to see query translation
2. ✅ Run `node simple-explain-test.js` to see span explanation
3. 📖 Read `docs/IMPLEMENTATION_SUMMARY.md` for technical details
4. 📖 Explore `sample-data/` to see example traces
5. 🔧 Try modifying queries in the test files

---

## Additional Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Quick start guide
- **[TESTING.md](./TESTING.md)** - Testing guide
- **[sample-data/README.md](./sample-data/README.md)** - Sample data documentation
- **[docs/](./docs/)** - Technical deep dives

---

## Summary for Absolute Beginners

**What you need to know**:
1. This is a **backend API**, not a website
2. There is **no visual interface** - that's intentional
3. You need **two terminals**: one for server, one for commands
4. **Answers appear in Terminal 2**, not in the browser
5. The browser is only for checking `/health`
6. `localhost:3000/` showing JSON **is correct**, not broken
7. This is how real backend development works

**You're doing it right!** 🎉

---

**Built as a functional prototype to demonstrate AI integration patterns for observability tools.**
