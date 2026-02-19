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

**Nx monorepo** with three projects:
- `apps/p-frog` — React 17 SPA (Vite, Tailwind CSS v4, TanStack Query/Store, React Router v6)
- `apps/api` — Express REST API (MongoDB via Mongoose, JWT auth)
- `apps/p-frog-e2e` — Cypress E2E tests
- `libs/data` — Shared TypeScript interfaces between frontend and backend, imported as `@p-frog/data`

## Environment Files

These files are **not in the repo** and must be created manually:
- `apps/api/.env.development`, `.env.production`, `.env.test`
- `apps/p-frog/.env.development`

Default MongoDB credentials (from `docker-compose.yml`): username `admin`, password `pfrogpswrd`.
Missing env files cause startup failures with exit code 127.

## Backend Patterns (`apps/api`)

### Route → Service → Schema
All API features follow three layers:
1. **Routes** (`src/routes/*.route.ts`) — HTTP handlers, exports `AppRouter = { url, router }`. All routes mount at `/api` prefix.
2. **Services** (`src/services/*.service.ts`) — Business logic, aliased as `@controllers` (historical naming inconsistency).
3. **Schemas** (`src/schemas/*.schema.ts`) — Mongoose models; export `IDocument` interface and Mongoose `Model`. All schemas transform `_id` → `id` in JSON via `toJSON`.

### Key Aliases (backend `tsconfig.json`)
- `@controllers` → `src/services/index.ts` (named controllers, implemented as services)
- `@models` → `src/models/index.ts` (plain TS interfaces for DTOs)
- `@schemas` → `src/schemas/index.ts` (Mongoose schemas/models)
- `@routes`, `@config`, `@utils`, `@types` → their respective `src/` subdirectories

### Authentication
- JWT middleware in `src/middleware/authentication.ts`
- Token read from `x-access-token` header, `req.query.token`, or `req.body.token`
- Format: `Bearer <jwt>` — middleware splits on space to extract token

### Database
Connection string requires `?authSource=admin`:
```
mongodb://${user}:${pass}@${host}:${port}/${schema}?authSource=admin
```

## Frontend Patterns (`apps/p-frog`)

### State Management
- **TanStack Query v4** for server state — query hooks in `src/data/queries/`
- **TanStack Store** for client state — auth store in `src/data/store/authStore.ts`
- Custom hooks in `src/hooks/` wrap TanStack Query hooks for cleaner components

### Key Aliases (frontend `tsconfig.json`)
- `@components/*`, `@pages/*`, `@hooks/*`, `@data/*`, `@utils/*`, `@types`
- Always use these aliases — relative imports are not used in this codebase

### Styling: Tailwind CSS v4
- **No `tailwind.config.js` or `postcss.config.js`** — configuration lives in `src/globals.css` via `@theme` directive
- Vite plugin: `@tailwindcss/vite` (not PostCSS)
- Hybrid approach: Tailwind utility classes for layout/spacing; inline styles with CSS variables for theme colors (e.g., `backgroundColor: 'hsl(var(--button-create))'`)

### Component Organization
- Atomic/shared components in `src/components/`
- Page-specific components in `src/pages/*/components/`
- All exported through `index.ts` barrel files
- Use `React.lazy()` in `MenuItems.tsx` for page components to avoid circular dependencies

### Forms
- `react-hook-form` v7 with custom field components: `FormTextField`, `FormDateField`, `FormTextAreaField`, `RadioGroupField`
- Validation rules in `src/data/constans/validators.ts` (exported as `Validators` from `@data/index`)

## Gotchas

- `@controllers` alias points to `services/` — this is intentional (historical naming)
- Mongoose schemas serialize `_id` as `id` — use `id` in frontend code
- Tailwind v4 has no config file — don't create one
- Page components in `MenuItems.tsx` must use `React.lazy()` to avoid circular imports
- MongoDB connection string must include `?authSource=admin`
