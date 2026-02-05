# 🚀 Quick Start Guide

## Starting the Server

### 1. Install Dependencies (First Time Only)
```bash
cd "d:\OneDrive\Desktop\Jaeger Project\jaeger-ai-query-service"
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

You should see output like:
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

---

## Verifying the Server

### Open in Browser
```
http://localhost:3000/health
```

You should see:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-05T09:15:02.815Z",
  "service": "jaeger-ai-query-service"
}
```

### Using PowerShell
```powershell
Invoke-WebRequest -Uri http://localhost:3000/health -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Using cURL (if installed)
```bash
curl http://localhost:3000/health
```

---

## Testing the Endpoints

### 1. Test Query Translation
```bash
node simple-test.js
```

Or manually:
```powershell
$body = @{query = "show me slow requests in payment service"} | ConvertTo-Json
Invoke-WebRequest -Uri http://localhost:3000/api/search -Method POST -Body $body -ContentType "application/json" -UseBasicParsing | Select-Object -ExpandProperty Content
```

### 2. Test Span Explanation
```bash
node simple-explain-test.js
```

---

## Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/search` | Translate natural language to Jaeger search params |
| **POST** | `/api/explain` | Generate technical summary for a span |
| **GET** | `/health` | Health check (returns server status) |

---

## Default Configuration

- **Port**: 3000
- **Host**: localhost
- **Environment**: development
- **CORS**: Enabled for all origins
- **JSON Body Limit**: 10mb

---

## Stopping the Server

Press `Ctrl+C` in the terminal where the server is running.

You'll see:
```
SIGINT received, shutting down gracefully...
Server closed. Process exiting.
```

---

## Troubleshooting

### Port Already in Use
If you see "Port 3000 is already in use":

1. **Find the process:**
```powershell
Get-NetTCPConnection -LocalPort 3000
```

2. **Stop the process:**
```powershell
Stop-Process -Id <ProcessId>
```

3. **Or use a different port:**
```bash
PORT=3001 npm run dev
```

### Server Not Responding
1. Check if the server is running: `npm run dev`
2. Check the console for error messages
3. Verify you're in the correct directory
4. Try restarting: `Ctrl+C` then `npm run dev`

### Dependencies Missing
```bash
npm install
```

---

## Quick Test Commands

### Health Check
```bash
Invoke-WebRequest http://localhost:3000/health -UseBasicParsing
```

### Full Test Suite
```bash
# Query translation tests
node test-query.js

# Span explanation tests
node test-explain.js
```

### Simple Tests
```bash
# Single query test
node simple-test.js

# Single explain test
node simple-explain-test.js
```

---

## Current Status

✅ Server is **currently running** (started 44+ minutes ago)  
✅ Listening on: **http://localhost:3000**  
✅ Health endpoint: **http://localhost:3000/health**  

You can test it right now without restarting!

---

## Next Steps

1. ✅ **Verify health endpoint**: Open http://localhost:3000/health
2. ✅ **Run quick tests**: `node simple-test.js` and `node simple-explain-test.js`
3. ✅ **Try full test suites**: `node test-query.js` and `node test-explain.js`
4. 📖 **Read the docs**: See README.md for detailed information

---

**The server is ready to use! 🎉**
