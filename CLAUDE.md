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

**Nx monorepo** (v22.6.4) with:
- `apps/p-frog` — React 18 SPA (Vite 8, Tailwind CSS v4, TanStack Query v5, TanStack Store v0.7, React Router v6)
- `apps/api` — Express REST API (MongoDB 7 via Mongoose 8, Better Auth)
- `apps/p-frog-e2e` — Cypress 15 E2E tests
- `libs/data` — Shared TypeScript interfaces between frontend and backend, imported as `@p-frog/data`

## Environment Files

These files are **not in the repo** — use the `.env.example` in each app as a template:

**`apps/api/.env.development` (required vars):**
```
SERVER_HOST=localhost
SERVER_PORT=3333
DB_HOST=localhost
DB_PORT=27017
DB_SCHEMA=p-frog
DB_USERNAME=admin
DB_PASSWORD=pfrogpswrd
BETTER_AUTH_SECRET=<random-secret>
BETTER_AUTH_URL=http://localhost:3333
FRONTEND_URL=http://localhost:4200
# Optional SMTP for magic-link auth:
SMTP_HOST=, SMTP_PORT=, SMTP_USER=, SMTP_PASS=, SMTP_FROM=
# Optional OpenSearch logging:
OPENSEARCH_HOST=, OPENSEARCH_PORT=
```

**`apps/p-frog/.env.development` (required vars):**
```
VITE_SERVER_HOST=localhost
VITE_SERVER_PORT=3333
```

Missing env files cause startup failures with exit code 127.

## Backend Patterns (`apps/api`)

### Route → Service → Schema
All API features follow three layers:
1. **Routes** (`src/routes/*.route.ts`) — HTTP handlers, exports `AppRouter = { url: string; router: Router }`. All routes mount at `/api` prefix. Note: `uesr.route.ts` is a legacy typo — it handles `/users`.
2. **Services** (`src/services/*.service.ts`) — Business logic, aliased as `@controllers` (historical naming).
3. **Schemas** (`src/schemas/*.schema.ts`) — Mongoose models; export `IDocument` interface and Mongoose `Model`. All schemas transform `_id` → `id` in JSON via `toJSON`.

**Active routes:** `health`, `task`, `project`, `project-member`, `settings`, `user` (file: `uesr.route.ts`)

### Key Aliases (backend `tsconfig.json`)
- `@controllers` → `src/services/index.ts` (named controllers, implemented as services)
- `@models` → `src/models/index.ts` (plain TS interfaces for DTOs)
- `@schemas` → `src/schemas/index.ts` (Mongoose schemas/models)
- `@routes`, `@config`, `@utils`, `@types` → their respective `src/` subdirectories
- `@p-frog/data` → `../../libs/data/index.ts`

### Authentication (Better Auth)
Authentication uses [Better Auth](https://better-auth.dev) — **not JWT**. The old JWT pattern is replaced.

- Backend config: `src/config/auth.ts` — `createAuth()` using MongoDB adapter
- Auth middleware: `src/middleware/authentication.ts` — validates session cookie via `_auth.api.getSession()`
- After validation, `req.user` holds the session user and `req.session_data` holds session metadata
- Supports: email/password, magic link (SMTP required), two-factor authentication
- Better Auth handler mounted at `/api/auth/*` via `app.configure()`
- Swagger UI available at `/api/docs`

**Better Auth user sync:** When a new user registers, a database hook in `src/config/auth.ts` automatically creates a matching document in the `User` Mongoose schema to preserve the app's user model.

### Authorization & Roles
- System roles (from `@p-frog/data`): `SUPERUSER`, `ADMIN`, `PROJECT_MANAGER`, `MEMBER`
- Permission helpers: `src/services/permission.service.ts`
- Project-level roles: `ADMIN`, `MEMBER` (see `ProjectRole` enum)

### Database
Connection string requires `?authSource=admin`:
```
mongodb://${user}:${pass}@${host}:${port}/${schema}?authSource=admin
```

### Logging
- Winston logger at `src/utils/logger.ts`
- Optional OpenSearch sink via `winston-opensearch` (enable the `logging` Docker profile)
- Docker: `docker-compose --profile logging up -d` starts OpenSearch + Dashboards

## Frontend Patterns (`apps/p-frog`)

### Routing & Auth Flow
- Root (`/`) redirects to `/welcome`
- Public routes: `/welcome`, `/login`, `/registration`
- Protected routes wrapped in `<ProtectedRoute />` (uses `isAuth` from authStore)
- Admin-only routes guarded by `<RequireAdmin>` (requires `ADMIN` or `SUPERUSER` role)
- `AuthInitializer` component in `app.tsx` syncs Better Auth session → authStore on mount

### Auth Client (`src/lib/auth-client.ts`)
```typescript
import { signIn, signUp, signOut, useSession, getSession } from '@lib/auth-client';
```
- `useSession()` — React hook, returns `{ data: session, isPending }`
- `session.user` contains the authenticated user object

### State Management
- **TanStack Query v5** for server state — query hooks in `src/data/queries/`
- **TanStack Store** for client state — auth store in `src/data/store/authStore.ts`
- Query client configured in `src/data/store/queryClient.ts`
- Custom hooks in `src/hooks/` wrap TanStack Query hooks for cleaner components

**Auth store API:**
```typescript
import { authStore, setAuth, clearAuth, selectIsAuth, selectUser, selectAuthError } from '@data/store/authStore';
import { useStore } from '@tanstack/react-store';

const isAuth = useStore(authStore, selectIsAuth);
const user = useStore(authStore, selectUser);
setAuth(true, user);   // on login
clearAuth();           // on logout
```

### Key Aliases (frontend `tsconfig.json`)
- `@components/*`, `@pages/*`, `@hooks/*`, `@data/*`, `@utils/*`
- `@lib/*` → `src/lib/` (auth-client, utils)
- `@icons/*`, `@styles`, `@types`
- `@p-frog/data` → shared types library
- Always use these aliases — relative imports are not used in this codebase

### Styling: Tailwind CSS v4
- **No `tailwind.config.js` or `postcss.config.js`** — configuration lives in `src/globals.css` via `@theme` directive
- Vite plugin: `@tailwindcss/vite` (not PostCSS)
- Hybrid approach: Tailwind utility classes for layout/spacing; inline styles with CSS variables for theme colors
- Example: `style={{ backgroundColor: 'hsl(var(--button-create))' }}`
- CSS variables for colors, sidebar widths, header heights defined in `globals.css`
- Dark mode via `.dark` class selector

### Component Organization
- Shared/atomic components in `src/components/`
- Page-specific components in `src/pages/*/components/`
- All exported through `index.ts` barrel files
- Page components in `app.tsx` use `React.lazy()` to avoid circular dependencies (all pages lazy-imported)
- Vite dev proxy: requests to `/api` are proxied to `http://localhost:3333`

**Component directories:** `auth`, `content-header`, `drawer`, `dropdown`, `footer`, `form`, `header`, `icon-rail`, `loader`, `main`, `notifications`, `page-transition`, `protected-route`, `side-nav`, `theme-toggle`, `top-bar-table`, `ui`

### Forms
- `react-hook-form` v7 with custom field components: `FormTextField`, `FormDateField`, `FormTextAreaField`, `RadioGroupField`
- Validation rules in `src/data/constans/validators.ts` (exported as `Validators` from `@data/index`)

### Notifications
- `SnackbarProvider` wraps the app in `app.tsx`
- Import `useSnackbar` from `@components/notifications/snackbar-context` in any component

## Shared Types (`libs/data`)

Imported as `@p-frog/data` in both frontend and backend.

**Key exports:**
- `SystemRole` enum: `SUPERUSER | ADMIN | PROJECT_MANAGER | MEMBER`
- `ProjectRole` enum: `ADMIN | MEMBER`
- Interfaces: `User`, `Project`, `Task`, `ProjectMember`, `AuthCredentials`, `AuthResponse`
- `TaskStatus` enum: `TODO | IN_PROGRESS | DONE | CANCELLED`
- `Dict<T>` utility type

## Cypress E2E Tests (`apps/p-frog-e2e`)

- Config: `cypress.config.ts` — base URL: `http://localhost:4200`
- Specs: `src/integration/` (auth, dashboard, navigation, projects, settings, tasks)
- Fixtures: `src/fixtures/` (example, projects, tasks, users)
- Commands/helpers: `src/support/`

## Gotchas

- `@controllers` alias points to `services/` — this is intentional (historical naming)
- Mongoose schemas serialize `_id` as `id` — use `id` in frontend code
- Tailwind v4 has no config file — don't create one
- Page components must use `React.lazy()` in `app.tsx` to avoid circular imports
- MongoDB connection string must include `?authSource=admin`
- Auth is **Better Auth** (session cookies), not JWT header tokens — the old `x-access-token` pattern is gone
- TanStack Query is **v5** — the API differs from v4 (e.g., `isLoading` → `isPending`, no `status === 'loading'`)
- The user route file is `uesr.route.ts` (typo) — don't rename it without updating `main.ts`
- React is v18 (not v17 as older docs may say)
- Frontend `@lib/*` alias covers `src/lib/` — use it for auth-client imports
