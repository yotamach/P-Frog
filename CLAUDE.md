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
- `apps/p-frog` — React 18 SPA (Vite, Tailwind CSS v4, TanStack Query v5/Store, React Router v6)
- `apps/api` — Express REST API (MongoDB via Mongoose, JWT auth)
- `apps/p-frog-e2e` — Cypress E2E tests
- `libs/data` — Shared TypeScript interfaces between frontend and backend, imported as `@p-frog/data`

Supplementary docs: `TESTING.md`, `E2E-TESTS.md`, `AGENTS.md`.

## Environment Files

These files are **not in the repo** and must be created manually:
- `apps/api/.env.development`, `.env.production`, `.env.test`
- `apps/p-frog/.env.development`

See `apps/api/.env.example` and `apps/p-frog/.env.example` for required variables.

Default MongoDB credentials (from `docker-compose.yml`): username `admin`, password `pfrogpswrd`.
Missing env files cause startup failures with exit code 127.

Frontend env vars must be prefixed `VITE_` (e.g. `VITE_API_URL`, `VITE_SERVER_HOST`, `VITE_SERVER_PORT`).

## Backend Patterns (`apps/api`)

### Route → Service → Schema
All API features follow three layers:
1. **Routes** (`src/routes/*.route.ts`) — HTTP handlers, exports `AppRouter = { url, router }`. All routes mount at `/api` prefix.
2. **Services** (`src/services/*.service.ts`) — Business logic, aliased as `@controllers` (historical naming inconsistency).
3. **Schemas** (`src/schemas/*.schema.ts`) — Mongoose models; export `IDocument` interface and Mongoose `Model`. All schemas transform `_id` → `id` in JSON via `toJSON`.

Current routes: `auth`, `task`, `project`, `project-member`, `settings`, `user` (file is `uesr.route.ts` — known typo), `health`.

### Key Aliases (backend `tsconfig.json`)
- `@controllers` → `src/services/index.ts` (named controllers, implemented as services)
- `@models` → `src/models/index.ts` (plain TS interfaces for DTOs)
- `@schemas` → `src/schemas/index.ts` (Mongoose schemas/models)
- `@routes`, `@config`, `@utils`, `@types` → their respective `src/` subdirectories

### Authentication
- JWT middleware in `src/middleware/authentication.ts`
- Token read from `x-access-token` header, `req.query.token`, or `req.body.token`
- Format: `Bearer <jwt>` — middleware splits on space to extract token

### Authorization
- Authorization middleware in `src/middleware/authorization.ts`
- Middleware factories: `requireSuperuser()`, `requireAdmin()`, `requireProjectRole(...roles)`, `requireProjectMember()`, `requireProjectAdmin()`, `requireProjectManagerOrAbove()`, `attachPermissionContext()`
- All factories return async Express middleware; project ID sourced from `req.params.projectId` or `req.params.id`

### Permission Service (`src/services/permission.service.ts`)
Re-exported from `@controllers`. Key functions:
- `isSuperuser(userId)`, `isAdmin(userId)`, `isProjectManagerOrAbove(userId)`
- `getUserProjectRole(userId, projectId)`, `isProjectMember(userId, projectId)`, `isProjectAdmin(userId, projectId)`
- `canAccessProject(userId, projectId)`, `canManageProject(userId, projectId)`
- `canModifyTask(userId, createdBy, assignee, projectId)`, `canCreateTaskInProject(userId, projectId)`, `canAssignTask(userId, projectId)`

### Roles

**SystemRole** (user-level, defined in `@p-frog/data` and re-exported from `@schemas`):
- `SUPERUSER` → full access
- `ADMIN` → platform admin
- `PROJECT_MANAGER` → can manage projects they are admin of
- `MEMBER` → default

**ProjectRole** (project-level membership, `@schemas`):
- `admin` — can manage project members, assign tasks
- `member` — can create tasks, view project

### Database
Connection string requires `?authSource=admin`:
```
mongodb://${user}:${pass}@${host}:${port}/${schema}?authSource=admin
```

Migrations live in `src/migrations/` (e.g. `001-add-project-members.ts`).

### API Documentation
Swagger UI is served at `GET /api/api-docs` in development. JSDoc annotations in route files generate the spec via `swagger-jsdoc`. Config is in `src/config/swagger.ts`.

## Frontend Patterns (`apps/p-frog`)

### Routing (`src/app/app.tsx`)
- `/` redirects to `/welcome`
- Public: `/welcome`, `/login`, `/registration`
- Protected (require auth): `/home` (layout) → `/home` (Dashboard), `/home/tasks/*`, `/home/projects`, `/home/settings`
- Admin-only: `/home/users` — guarded by inline `RequireAdmin` component checking `SystemRole.ADMIN | SUPERUSER`

### State Management
- **TanStack Query v5** for server state — query hooks in `src/data/queries/`
- **TanStack Store** for client state — auth store in `src/data/store/authStore.ts`
- Custom hooks in `src/hooks/` wrap store/query hooks (e.g. `useAuth`, `useTask`)

### HTTP API Layer (`src/data/services/`)
- `request` object (axios-compatible fetch wrapper) defined in `src/data/services/index.ts`
- Auth token auto-injected from `authStore` as `x-access-token: Bearer <token>`
- On 401, automatically calls `clearAuth()`
- Domain services: `AuthAPI`, `TasksAPI`, `ProjectsAPI`, `UsersAPI`
- Base URL: `VITE_API_URL` env var or falls back to `http://${VITE_SERVER_HOST}:${VITE_SERVER_PORT}/api/`

### Auth Store (`src/data/store/authStore.ts`)
- Persists `token` and `user` to `localStorage`
- `initializeAuth()` restores session on app load (called in `App` `useEffect`)
- `useAuth()` hook exposes `{ isAuth, user, error, login, logout }`

### Notifications (`src/components/notifications/snackbar-context.tsx`)
- `SnackbarProvider` wraps the app; renders toast stack at bottom-right
- `useSnackbar()` hook returns `{ enqueueSnackbar, closeSnackbar }`
- Variants: `'default' | 'success' | 'error' | 'warning' | 'info'`
- Usage: `const { enqueueSnackbar } = useSnackbar(); enqueueSnackbar('Saved', { variant: 'success' })`

### Key Aliases (frontend `tsconfig.json`)
- `@components/*`, `@pages/*`, `@hooks/*`, `@data/*`, `@utils/*`, `@types`
- Always use these aliases — relative imports are not used in this codebase

### Component Organization
- Atomic/shared components in `src/components/` (barrel: `src/components/index.ts`)
- shadcn/ui components in `src/components/ui/` — do not modify generated files directly
- Page-specific components in `src/pages/*/components/`
- All exported through `index.ts` barrel files
- Use `React.lazy()` for page-level components wherever they are imported (both in `app.tsx` and `MenuItems.tsx`) to avoid circular dependencies
- `src/lib/utils.ts` — shadcn `cn()` utility (clsx + tailwind-merge)

### Styling: Tailwind CSS v4
- `apps/p-frog/tailwind.config.js` exists but is minimal (content paths + `tw-animate-css` plugin)
- Theme configuration lives in `src/globals.css` via `@theme inline` and `:root` CSS variables
- Vite plugin: `@tailwindcss/vite` (not PostCSS); `@plugin "tailwindcss-animate"` in globals.css
- Hybrid approach: Tailwind utility classes for layout/spacing; inline styles with CSS variables for theme colors
  - e.g. `style={{ backgroundColor: 'hsl(var(--button-create))' }}`
  - Prefer `var(--color-*)` (new `--color-` prefixed vars) over legacy bare vars like `var(--button-create)`
- Dark mode: `.dark` class on `<html>` toggles dark theme; `ThemeToggle` component in `src/components/theme-toggle/`
- **Do not create a `postcss.config.js`**

### Layout
- Icon rail (`--rail-width: 60px`, dark walnut) + content area with header + footer
- CSS classes: `.icon-rail`, `.rail-item`, `.rail-item.active`, `.content-header`, `.app-main`
- Rail items use `data-tooltip` attribute for CSS-only hover tooltips
- Layout CSS variables: `--header-height: 3.5rem`, `--rail-width: 60px`, `--footer-height: 2.25rem`

### Forms
- `react-hook-form` v7 with custom field components: `FormTextField`, `FormDateField`, `FormTextAreaField`, `RadioGroupField` (in `src/components/form/FormFields.tsx`)
- Validation rules in `src/data/constans/validators.ts` (exported as `Validators` from `@data/index`)

## Shared Library (`libs/data`)

Imported as `@p-frog/data` by both frontend and backend. Exports:
- **`SystemRole`** enum: `SUPERUSER | ADMIN | PROJECT_MANAGER | MEMBER`
- **`ProjectRole`** enum: `admin | member`
- **`TaskStatus`** enum: `TODO | IN_PROGRESS | DONE | CANCELLED`
- **`ProjectPriority`** enum: `LOW | MEDIUM | HIGH | CRITICAL`
- Interfaces: `User`, `Task`, `Project`, `ProjectMember`, `AuthCredentials`, `AuthResponse`, `Dict`

## Deployment

- `render.yaml` — Render.com config
- `vercel.json` — Vercel config

## Gotchas

- `@controllers` alias points to `services/` — this is intentional (historical naming)
- Mongoose schemas serialize `_id` as `id` — use `id` in frontend code; `password` and `token` are stripped from `User` JSON
- `apps/api/src/routes/uesr.route.ts` — typo in filename (`uesr` not `user`); do not rename without updating the import in `routes/index.ts`
- Tailwind v4: `tailwind.config.js` exists but only for content paths; all theme/color config lives in `globals.css`
- Page components must use `React.lazy()` wherever imported (both `app.tsx` and `MenuItems.tsx`) to prevent circular dependencies
- MongoDB connection string must include `?authSource=admin`
- Node.js >= 20.18.0 required (`engines` field in `package.json`)
- Git hooks are installed automatically via `postinstall` → `tools/install-hooks.sh`
- TanStack Query is v5 (API differs from v4: no `onSuccess`/`onError` in `useQuery`, use `queryClient.invalidateQueries` with object syntax, etc.)
