# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

Start services in this order:
```bash
docker-compose up -d              # MongoDB 7.0 on port 27017
yarn start:server-dev             # Express backend on :3333 (requires .env.development)
yarn start                        # Vite frontend on :4200
```

### Testing
```bash
yarn client:test                  # Frontend unit tests (Jest)
yarn test:server                  # Backend unit tests (Jest)
yarn e2e                          # Cypress E2E tests (interactive)
yarn e2e:headless                 # Cypress E2E tests (headless)
```

To run a single frontend test file:
```bash
npx nx test p-frog --testFile=path/to/spec.ts
```

To run a single backend test file:
```bash
npx nx test api --testFile=path/to/spec.ts
```

### Building & Linting
```bash
yarn build                        # Production frontend build
yarn build:server                 # Production backend build
yarn lint                         # Lint all projects
yarn lint:fix                     # Auto-fix lint issues
```

## Architecture

**Nx monorepo** with four projects:
- `apps/p-frog` — React 18 SPA (Vite, Tailwind CSS v4, TanStack Query v5/Store, React Router v6, shadcn/ui)
- `apps/api` — Express REST API (MongoDB via Mongoose, JWT auth, role-based authorization)
- `apps/p-frog-e2e` — Cypress 15 E2E tests
- `libs/data` — Shared TypeScript interfaces between frontend and backend, imported as `@p-frog/data`

Additional documentation:
- `AGENTS.md` — AI agent-specific guidance
- `TESTING.md` — Testing strategy and guidelines
- `E2E-TESTS.md` — E2E test documentation

## Environment Files

These files are **not in the repo** and must be created manually:
- `apps/api/.env.development`, `.env.production`, `.env.test`
- `apps/p-frog/.env.development`

Default MongoDB credentials (from `docker-compose.yml`): username `admin`, password `pfrogpswrd`.
Missing env files cause startup failures with exit code 127.

**Backend template (`apps/api/.env.development`):**
```
SERVER_HOST=localhost
SERVER_PORT=3333
DB_HOST=localhost
DB_PORT=27017
DB_SCHEMA=p-frog
DB_USERNAME=admin
DB_PASSWORD=pfrogpswrd
JWT_SECRET=your-secret-here
```

**Frontend template (`apps/p-frog/.env.development`):**
```
VITE_SERVER_HOST=localhost
VITE_SERVER_PORT=3333
```

## Backend Patterns (`apps/api`)

### Route → Service → Schema
All API features follow three layers:
1. **Routes** (`src/routes/*.route.ts`) — HTTP handlers, exports `AppRouter = { url, router }`. All routes mount at `/api` prefix.
2. **Services** (`src/services/*.service.ts`) — Business logic, aliased as `@controllers` (historical naming inconsistency).
3. **Schemas** (`src/schemas/*.schema.ts`) — Mongoose models; export `IDocument` interface and Mongoose `Model`. All schemas transform `_id` → `id` in JSON via `toJSON`.

Current route files: `auth.route.ts`, `task.route.ts`, `project.route.ts`, `project-member.route.ts`, `uesr.route.ts` (typo — keep as-is), `settings.route.ts`.

### Key Aliases (backend `tsconfig.json`)
- `@controllers` → `src/services/index.ts` (named controllers, implemented as services)
- `@models` → `src/models/index.ts` (plain TS interfaces for DTOs)
- `@schemas` → `src/schemas/index.ts` (Mongoose schemas/models)
- `@routes`, `@config`, `@utils`, `@types` → their respective `src/` subdirectories

### Authentication
- JWT middleware in `src/middleware/authentication.ts`
- Token read from `x-access-token` header, `req.query.token`, or `req.body.token`
- Format: `Bearer <jwt>` — middleware splits on space to extract token
- Tokens expire in 2 hours; default JWT secret is in `authentication.ts` but should be overridden via `JWT_SECRET` env var

### Authorization
Middleware factory functions in `src/middleware/authorization.ts`:
- `requireSuperuser()` — superusers only
- `requireProjectRole(role)` — requires a specific project role
- `requireProjectMember()` — any project member
- `requireProjectAdmin()` — project admins only
- `attachPermissionContext()` — non-blocking, attaches permission context to request

Authorization hierarchy (highest to lowest): **Superuser → ProjectAdmin → ProjectMember → Task Creator/Assignee**

### Database
Connection string requires `?authSource=admin`:
```
mongodb://${user}:${pass}@${host}:${port}/${schema}?authSource=admin
```

Mongoose `strictQuery` is disabled to allow flexible querying.

### API Documentation
Swagger UI available at `/api/docs` when the server is running. Routes are documented with JSDoc comments in route files.

### Error Response Format
```json
{ "success": false, "error": <error> }
{ "success": true, "data": <payload> }
```

## Frontend Patterns (`apps/p-frog`)

### State Management
- **TanStack Query v5** for server state — query hooks in `src/data/queries/`
  - QueryClient: 5-minute stale time, 1 retry, no refetch on window focus
  - Query keys: `['auth']`, `['tasks']`, `['projects']`
- **TanStack Store** for client state — auth store in `src/data/store/authStore.ts`
  - State: `isAuth`, `user`, `token`, `error`
  - Actions: `setAuth()`, `setAuthError()`, `clearAuth()`
  - Selectors: `selectIsAuth()`, `selectUser()`, `selectAuthError()`
  - Persists to/from `localStorage` via `initializeAuth()`
- Custom hooks in `src/hooks/` wrap TanStack Query hooks for cleaner components

### HTTP Client
A custom fetch-based `request` object (not axios) in `src/data/services/`:
- Axios-compatible interface: returns `{ data: T }`
- Error format: `{ response: { status, data } }`
- Auto-injects `Bearer <token>` from authStore
- 1-second timeout via `AbortController`
- Automatically clears auth on 401 responses

### Routing
React Router v6 with Suspense boundaries:
- `/` → redirect to `/welcome`
- Public: `/welcome`, `/login`, `/registration` (page dir: `src/pages/registration/`)
- Protected (require auth): `/home` layout wrapper
  - `/home` — dashboard (default)
  - `/home/tasks/*`
  - `/home/projects`
  - `/home/settings`
- Catch-all 404 for authenticated and unauthenticated routes

### Key Aliases (frontend `tsconfig.json`)
- `@components/*`, `@pages/*`, `@hooks/*`, `@data/*`, `@utils/*`, `@types`
- Always use these aliases — relative imports are not used in this codebase

### Styling: Tailwind CSS v4
- **No `tailwind.config.js` or `postcss.config.js`** — configuration lives in `src/globals.css` via `@theme` directive
- Vite plugin: `@tailwindcss/vite` (not PostCSS)
- Hybrid approach: Tailwind utility classes for layout/spacing; inline styles with CSS variables for theme colors (e.g., `backgroundColor: 'hsl(var(--button-create))'`)
- Primary color: Bordo/Burgundy `#8B3A62` (hsl 345 85% 35%)
- 30+ custom CSS variables defined in `globals.css`

### Component Organization
- Atomic/shared components in `src/components/` (including `ui/` for shadcn/ui components)
- Page-specific components in `src/pages/*/components/`
- All exported through `index.ts` barrel files
- Use `React.lazy()` in `MenuItems.tsx` for page components to avoid circular dependencies
- shadcn/ui components (Radix UI primitives): sidebar, dialog, drawer, button, input, card, popover

### Forms
- `react-hook-form` v7 with custom field components: `FormTextField`, `FormDateField`, `FormTextAreaField`, `RadioGroupField`
- Validation rules in `src/data/constans/validators.ts` (note: `constans` is a typo — keep as-is; exported as `Validators` from `@data/index`)

## Shared Types (`libs/data`)

Imported as `@p-frog/data`. Key exports:
- `User`, `AuthCredentials`, `AuthResponse`
- `Project`, `ProjectMember`, `ProjectRole` enum (`ADMIN`, `MEMBER`), `ProjectPriority` enum (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`)
- `Task`, `TaskStatus` enum (`TODO`, `IN_PROGRESS`, `DONE`, `CANCELLED`)
- `Dict<T>` utility type

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) triggers on push/PR to `master`.

**Branch naming convention** (enforced by CI on PRs): `^PF-[0-9]+_[A-Za-z0-9_]+$`
- Example: `PF-123_Add_Login_Page`

**Jobs** (each skips if no relevant files changed):
1. `validate-branch-name` — enforces naming convention
2. `build-client` — frontend build
3. `build-server` — backend build
4. `server-unittests` — backend Jest tests
5. `e2e-tests` — full stack: spins up MongoDB, backend, frontend, then runs Cypress
6. `lint-client` / `lint-server` — linting

## Gotchas

- `@controllers` alias points to `services/` — this is intentional (historical naming)
- Mongoose schemas serialize `_id` as `id` — use `id` in frontend code
- Tailwind v4 has no config file — don't create one
- Page components in `MenuItems.tsx` must use `React.lazy()` to avoid circular imports
- MongoDB connection string must include `?authSource=admin`
- `uesr.route.ts` has a typo in the filename — do not rename (would require updating imports/config)
- `src/data/constans/` has a typo — do not rename (same reason)
- TanStack Query is **v5** (breaking changes from v4): `useQuery` options use `queryKey`/`queryFn`, `onSuccess`/`onError` callbacks moved to `useMutation`
- The HTTP client is a custom fetch wrapper, **not axios** — don't add axios as a dependency
- React version is **18** (not 17) — StrictMode double-invocation applies in development
