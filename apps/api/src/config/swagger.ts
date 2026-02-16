import swaggerJsdoc from 'swagger-jsdoc';
import { BASE_API } from './config';
import path from 'path';

// Get the directory of the current file and resolve routes path
// Support both source .ts files and compiled .js files
const routesDir = path.join(__dirname, '../routes');
const routesPaths = [
  path.join(routesDir, '*.ts'),
  path.join(routesDir, '*.js'),
];

console.log('Swagger scanning routes at:', routesPaths);

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'P-Frog API',
      version: '1.0.0',
      description: 'Task management API documentation',
    },
    servers: [
      {
        url: `http://localhost:3333${BASE_API}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Task: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['todo', 'in-progress', 'done'] },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            due_date: { type: 'string', format: 'date-time' },
            project: { type: 'string' },
            assignee: { type: 'string' },
            created_by: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
          },
        },
        Project: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            created_by: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        SignupRequest: {
          type: 'object',
          required: ['email', 'password', 'first_name', 'last_name'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            token: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', default: false },
            error: { type: 'string' },
          },
        },
      },
    },
  },
  apis: routesPaths,
};

export const swaggerSpec = swaggerJsdoc(options);
