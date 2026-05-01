# Plan: Fix E2E Test Backend Startup Failure in CI/CD

## Context

The E2E tests are failing in CI/CD because the backend health check (`curl -sf http://localhost:3333/api/health`) is timing out after 180 seconds. The backend server starts but either:
1. Isn't responding to the health check
2. Crashes during startup
3. Has issues binding to the correct host/port

The issue is that:
- The backend server starts but doesn't wait for the database to connect
- The server listens without explicitly binding to the correct hostname
- The health endpoint doesn't verify database connectivity
- No error output is captured in CI when the backend fails silently

## Root Causes Identified

1. **App.ts (line 28)**: `this.app.listen(this.port, ...)` doesn't bind to `this.host` explicitly. In CI with Docker containers, localhost might not resolve correctly.

2. **main.ts (lines 20-21)**: The database connection happens AFTER `app.start()` without awaiting. If DB connection fails, the app is still "running" but possibly in a broken state.

3. **health.route.ts**: The health endpoint doesn't verify database connectivity - just returns `{ status: 'ok' }` immediately.

4. **CI/CD Workflow (e2e.yml line 80)**: The backend process runs in background (`yarn start:server-dev &`) but there's no way to capture its output if it crashes.

## Solution Overview

Complete restructure of the backend startup flow to ensure database connectivity is verified before the server starts accepting requests.

### 1. Restructure App.ts - Return Promise from start(), Proper Host Binding
**File**: `apps/api/src/App.ts`
- Change `start()` method to return a Promise that resolves when the server is listening
- Explicitly bind to `this.host` parameter (not just the port)
- Add the `dbConnect()` method result to the initialization chain

### 2. Make dbConnect() Return a Promise
**File**: `apps/api/src/App.ts`
- Change `dbConnect()` to be async and return a Promise
- Return after successful connection (or reject on failure)
- Move Mongoose connection before server starts listening

### 3. Restructure main.ts - Async Startup
**File**: `apps/api/src/main.ts`
- Make the startup sequence async
- Call `app.start()` first (configure + setup swagger + add routes)
- Await `app.dbConnect()` to ensure database is connected
- Only then let the server accept requests

### 4. Improve health.route.ts - Check DB Connectivity
**File**: `apps/api/src/routes/health.route.ts`
- Import Mongoose's connection state checker
- Return `{ status: 'ok', database: 'connected' }` only when `mongoose.connection.readyState === 1` (CONNECTED)

### 5. CI/CD Improvements (e2e.yml)
**File**: `.github/workflows/e2e.yml`
- Add backend output capture by removing the `&` background process and using `nohup` or similar for proper logging
- Improve health check error messages to show curl output if it fails
- Add timeout information

## Implementation Details

### App.ts Changes
- `start()` now returns `Promise<void>` and resolves after `server.listen()` callback
- `dbConnect()` becomes async and returns `Promise<void>`, connects before returning
- Constructor and `configure()` remain unchanged

### main.ts Changes
- Wrap startup in async IIFE or use top-level async (Node 14.8+)
- Call `app.configure()`, `app.setupSwagger()`, `app.addRouter()` calls
- Await `app.dbConnect(...)` 
- Call `app.start()` and await it
- Add error handler for startup failures

### health.route.ts Changes
- Check `mongoose.connection.readyState === 1` (CONNECTED constant = 1)
- Return early with 500 status if database not connected
- Response: `{ status: 'ok', database: 'connected' }`

## Files to Modify

1. `apps/api/src/App.ts` - Make start() and dbConnect() async, proper host binding
2. `apps/api/src/main.ts` - Restructure startup to await DB connection
3. `apps/api/src/routes/health.route.ts` - Verify Mongoose is connected
4. `.github/workflows/e2e.yml` - Optional: better error logging

## Verification

After changes:
1. Run backend locally: `yarn start:server-dev`
2. Test health endpoint: `curl http://localhost:3333/api/health` 
   - Should return `{ status: 'ok', database: 'connected' }` (not before DB connects)
3. Verify backend logs show "Connected to mongoDB DB: p-frog" before "Listening at..."
4. Run e2e tests locally: `yarn e2e:headless`
5. Verify CI/CD passes on a PR that modifies `apps/api/`, `apps/p-frog/`, or `libs/data/`
