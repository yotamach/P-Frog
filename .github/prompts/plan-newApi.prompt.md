# Plan: Create New API with Service, Model, Schema & Tests

This plan outlines the steps to create a complete new API endpoint following the existing patterns in the P-Frog backend. You'll create a model (DTO interface), Mongoose schema, service class with business logic, Express routes, and comprehensive unit tests for each layer.

## Steps

1. **Create the Model** in `apps/api/src/models/` as `{entity}.model.ts`
   - Define TypeScript interface with DTO fields (e.g., `ExampleModel`)
   - Add any enums for status/type fields
   - Export from `apps/api/src/models/index.ts` barrel

2. **Create the Schema** in `apps/api/src/schemas/` as `{entity}.schema.ts`
   - Define `IExample extends Document` interface with Mongoose document fields
   - Create `ExampleSchema` with field definitions, types, and `required` flags
   - Add `toJSON` transform to convert `_id` → `id`
   - Export both `Example` model and `IExample` interface
   - Export from `apps/api/src/schemas/index.ts`

3. **Create the Service** in `apps/api/src/services/` as `{entity}.service.ts`
   - Create `ExampleService` class following `task.service.ts` pattern
   - Implement CRUD methods: `getAll`, `getById`, `create`, `update`, `delete`
   - Use `@schemas` for database operations and `tslog` Logger
   - Export from `apps/api/src/services/index.ts`

4. **Create the Route** in `apps/api/src/routes/` as `{entity}.route.ts`
   - Create Express Router with handlers for GET/POST/PATCH/DELETE
   - Instantiate service, apply `auth` middleware to protected routes
   - Export as `AppRouter` object: `{ url: '/{entity}s', router }`
   - Export from `apps/api/src/routes/index.ts`

5. **Register the Route** in `apps/api/src/main.ts`
   - Import new route and call `app.addRouter(exampleRoutes)` alongside existing routes

6. **Create Unit Tests** for all layers:
   - **Schema test** at `schemas/tests/{entity}.schema.spec.ts`: Test required fields, validation errors, model creation
   - **Service test** at `services/tests/{entity}.service.spec.ts`: Mock schema module, test each CRUD method
   - **Route test** at `routes/tests/{entity}.route.spec.ts`: Use supertest, mock service, test HTTP responses

## Further Considerations

1. **What entity name?** You have `settings.schema.ts` open—should this be a "Settings" API or a different entity?
2. **Authentication scope?** Should all routes require auth, or should some be public (e.g., GET for read-only data)?
3. **User ownership?** Should records be scoped by `created_by` user field like Tasks, or globally accessible?
