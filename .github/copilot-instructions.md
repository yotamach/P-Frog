# P-Frog AI Coding Agent Instructions

## Architecture Overview

P-Frog is an Nx monorepo with a React frontend (`apps/p-frog`), Express backend (`apps/api`), and shared library (`libs/data`). The backend uses MongoDB via Mongoose for persistence.

### Monorepo Structure
- **apps/p-frog**: React 17 SPA with Material-UI v5, Redux Toolkit, React Router v6
- **apps/api**: Express REST API with JWT authentication
- **libs/data**: Shared TypeScript interfaces used across frontend and backend
- **db/**: Local MongoDB data directory (gitignored, used with docker-compose)

## Critical Path Aliases

Both apps use extensive path aliases to avoid relative imports:

### Backend (`apps/api/tsconfig.json`)
- `@controllers` → `src/services/index.ts` (Note: naming inconsistency - services are aliased as controllers)
- `@models` → `src/models/index.ts` (Plain TypeScript interfaces)
- `@schemas` → `src/schemas/index.ts` (Mongoose schemas with IDocument interfaces)
- `@routes` → `src/routes/index.ts`
- `@p-frog/data` → `libs/data/src/index.ts` (shared library)

### Frontend (`apps/p-frog/webpack.config.js` via `aliases.js`)
- `@components/*` → `src/components/*`
- `@data/*` → `src/data/*` (Redux store, constants, validators)
- `@hooks/*` → `src/hooks/*`
- `@pages/*` → `src/pages/*` (components mapped in React Router)

**Always use these aliases in imports** - relative imports are not used in this codebase.

## Development Workflows

### Starting the Development Environment

**Critical**: The project requires environment files that are not in the repo:
- `apps/api/.env.development` (MongoDB credentials, JWT_SECRET)
- `apps/api/.env.production`
- `apps/p-frog/.env.development`

Default MongoDB credentials from `docker-compose.yml`:
```
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=pfrogpswrd
```

**Start order**:
1. MongoDB: `docker-compose up` (starts MongoDB on port 27017)
2. Backend: `yarn start:server-dev` (uses `env-cmd --file ./apps/api/.env.development nx serve api`)
3. Frontend: `yarn start` (uses `env-cmd --file ./apps/p-frog/.env.development nx serve`)

### Testing
- Frontend: `yarn client:test` → `nx test`
- Backend: `yarn test:server` → `nx test api`

### Building
- `yarn build` → `nx build` (builds default project: p-frog)

## Backend Patterns

### Route → Service → Schema Architecture

All API routes follow this three-layer pattern (see `apps/api/src/routes/task.route.ts`):

1. **Route** (`routes/*.route.ts`): Express router handling HTTP, creates `AppRouter` object
   ```typescript
   const taskRoutes: AppRouter = { url: '/tasks', router: taskRouter };
   ```
   All routes are mounted at `BASE_API` prefix (`/api`) in `App.ts`

2. **Service** (`services/*.service.ts`): Business logic, imported as `@controllers`
   - Contains CRUD operations
   - Calls Mongoose models from `@schemas`

3. **Schema** (`schemas/*.schema.ts`): Mongoose models
   - Exports `IDocument` interface (e.g., `ITask extends Document`)
   - Exports Mongoose Model (e.g., `Task: Model<ITask>`)
   - Transforms `_id` → `id` in JSON serialization via `toJSON` transform

### Models vs Schemas
- **Models** (`@models`): Plain TypeScript interfaces for request/response DTOs (e.g., `TaskModel`)
- **Schemas** (`@schemas`): Mongoose models with `IDocument` interfaces for database entities

### Authentication
- JWT-based auth middleware in `middleware/authentication.ts`
- Token verified from `x-access-token` header, `req.query.token`, or `req.body.token`
- Token format: `Bearer <jwt>` (split on space to extract token)
- Default JWT_SECRET: `'g2r0e1e3n_t2o5p8s5_e0n5e2r5g8y30119'` (fallback if env var missing)
- Auth routes: `/api/auth/login`, `/api/auth/signup`, `/api/auth/profile`

### Database Connection
The `App` class exposes `dbConnect()` called from `main.ts`:
```typescript
app.dbConnect(DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_SCHEMA);
```
Connection string: `mongodb://${userName}:${password}@${host}:${port}/${schema}`

## Frontend Patterns

### Redux Toolkit State Management

Store configured in `apps/p-frog/src/data/store/store.ts` with slices:
- `TASKS_FEATURE_KEY`: Task management (async thunks: `fetchTasks`, `createTask`, `updateTask`, `deleteTask`)
- `AUTH_FEATURE_KEY`: Authentication state

**Custom hooks pattern**: Components use hooks like `use-task` (in `hooks/use-task/use-task.ts`) that encapsulate Redux selectors and dispatch logic.

### React Router v6 Structure

Routes defined in `apps/p-frog/src/app/app.tsx`:
- `/` → Welcome page (public)
- `/home` → Home (authenticated)
- `/login`, `/registration` → Auth pages

Page components are in `apps/p-frog/src/pages/*` and referenced via `@pages/index` barrel export.

### Material-UI v5 Theming

Theme defined in `apps/p-frog/src/theme.ts` as `lighThemeOptions`, wrapped in `createTheme()` and provided via `ThemeProvider` in `app.tsx`.

### Component Organization
- Atomic components in `components/` (footer, header, form, table, loader, popup, etc.)
- Page-specific components nested in `pages/*/components/` (e.g., `pages/tasks/components/tasks-list/`)
- All exported through `index.ts` barrels for clean imports

### Forms
- Uses `react-hook-form` v7
- Custom form fields: `FormTextField`, `FormDateField` in `@components/form/FormFields`
- Validation rules in `apps/p-frog/src/data/constans/validators.ts` (imported as `Validators` from `@data/index`)

### Styling
- SCSS modules (`.module.scss`) configured in `webpack.config.js`
- CSS module support via `css-modules-typescript-loader`
- Global styles in `src/styles.scss`

## Nx-Specific Commands

This project uses **Nx 13.4.3** (older version):

- `nx serve [app]` - Dev server for app
- `nx test [app]` - Run Jest tests
- `nx build [app]` - Production build
- `nx dep-graph` - Visualize project dependencies
- `nx affected:test` - Test only affected projects
- `nx affected:build` - Build only affected projects

Default generators configured in `nx.json`:
- React components/apps use SCSS styling
- Babel enabled for React apps
- ESLint for linting

## Common Gotchas

1. **Service aliasing**: `@controllers` actually points to `services/` directory - historical naming inconsistency
2. **Environment files**: Missing `.env.*` files cause startup failures with exit code 127
3. **Token format**: Auth middleware expects `Bearer <token>` format, splits on space
4. **Mongoose transforms**: All schemas transform `_id` to `id` in JSON - use `id` in frontend code
5. **Path aliases**: Must be configured in both `tsconfig.json` (for TypeScript) and `webpack.config.js` (for Webpack bundling) for frontend
6. **CORS**: Backend has CORS enabled globally via `app.use(cors())` in `App.ts`
