# P-Frog 🐸

A full-stack task management application built with React and Express in an Nx monorepo.

## Tech Stack

### Frontend (`apps/p-frog`)
- **React 17** with TypeScript
- **Tailwind CSS v4** for styling
- **TanStack Query** for server state management
- **TanStack Store** for client state
- **React Router v6** for navigation
- **React Hook Form** for form handling
- **Vite** for fast development builds

### Backend (`apps/api`)
- **Express.js** REST API
- **MongoDB 7.0** with Mongoose ODM
- **JWT** authentication
- **TypeScript**

### Shared
- **libs/data** - Shared TypeScript interfaces

## Prerequisites

- Node.js >= 20.18.0
- Yarn >= 1.22.0
- Docker & Docker Compose

## Getting Started

### 1. Install Dependencies

```bash
yarn install
```

### 2. Set Up Environment Files

Create the following environment files:

**`apps/api/.env.development`**
```env
DB_HOST=localhost
DB_PORT=27017
DB_USERNAME=admin
DB_PASSWORD=pfrogpswrd
DB_SCHEMA=p-frog
JWT_SECRET=your-secret-key
```

**`apps/p-frog/.env.development`**
```env
VITE_API_URL=http://localhost:3333/api
```

### 3. Start MongoDB

```bash
docker-compose up -d
```

This starts MongoDB on port 27017 with the default credentials.

### 4. Start Development Servers

**Backend** (runs on http://localhost:3333):
```bash
yarn start:server-dev
```

**Frontend** (runs on http://localhost:4200):
```bash
yarn start
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `yarn start` | Start frontend dev server |
| `yarn start:server-dev` | Start backend dev server |
| `yarn build` | Build frontend for production |
| `yarn build:server` | Build backend for production |
| `yarn build:all` | Build all projects |
| `yarn lint` | Lint all projects |
| `yarn lint:fix` | Auto-fix lint issues |
| `yarn client:test` | Run frontend tests |
| `yarn test:server` | Run backend tests |
| `yarn e2e` | Run E2E tests |
| `yarn e2e:headless` | Run E2E tests headlessly |

## Project Structure

```
P-Frog/
├── apps/
│   ├── p-frog/              # React frontend
│   │   ├── src/
│   │   │   ├── app/         # App entry & routes
│   │   │   ├── components/  # Reusable UI components
│   │   │   ├── data/        # TanStack Query hooks & store
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   └── pages/       # Route page components
│   │   └── ...
│   ├── api/                 # Express backend
│   │   ├── src/
│   │   │   ├── models/      # TypeScript interfaces
│   │   │   ├── schemas/     # Mongoose schemas
│   │   │   ├── services/    # Business logic
│   │   │   └── routes/      # API route handlers
│   │   └── ...
│   └── p-frog-e2e/          # Cypress E2E tests
├── libs/
│   └── data/                # Shared TypeScript interfaces
├── db/                      # MongoDB data (Docker volume)
└── docker-compose.yml       # MongoDB container config
```

## API Documentation

Interactive API documentation is available via Swagger UI when running the backend:

```
http://localhost:3333/api/docs
```

## API Endpoints

All API routes are prefixed with `/api`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/signup` | User registration |
| GET | `/api/auth/profile` | Get current user |
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

## Testing

### Unit Tests
```bash
# Frontend tests
yarn client:test

# Backend tests
yarn test:server

# Run affected tests only
nx affected:test
```

### E2E Tests
```bash
# Interactive mode
yarn e2e

# Headless mode
yarn e2e:headless
```

## Nx Commands

```bash
# View project dependency graph
nx dep-graph

# Run affected tests
nx affected:test

# Run affected builds
nx affected:build
```

## License

MIT
