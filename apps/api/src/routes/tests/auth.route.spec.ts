/**
 * Backend Integration Tests for Auth Routes
 */

import express from 'express';
import request from 'supertest';

// Create mock functions that will be shared across all instances
const mockLogin = jest.fn();
const mockSignUp = jest.fn();

// Mock the AuthService before importing anything else
jest.mock('@controllers', () => ({
  AuthService: jest.fn().mockImplementation(() => ({
    Login: mockLogin,
    SignUp: mockSignUp,
  })),
}));

// Import after mocking
import authRoutes from '../auth.route';

describe('Auth Routes Integration', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(authRoutes.url, authRoutes.router);
    
    jest.clearAllMocks();
  });

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      // Arrange
      const loginData = {
        userName: 'testuser',
        password: 'password123'
      };

      const mockResponse = {
        status: 200,
        resBody: {
          success: true,
          data: {
            _id: 'user-id',
            userName: 'testuser',
            email: 'test@example.com',
            token: 'jwt-token'
          }
        }
      };

      mockLogin.mockResolvedValue(mockResponse);

      // Act
      const response = await request(app)
        .post('/auth/login')
        .send(loginData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBe('jwt-token');
    });

    it('should return 400 for invalid credentials', async () => {
      // Arrange
      const loginData = {
        userName: 'wronguser',
        password: 'wrongpass'
      };

      const mockResponse = {
        status: 400,
        resBody: {
          success: false,
          data: 'Invalid Credentials!'
        }
      };

      mockLogin.mockResolvedValue(mockResponse);

      // Act
      const response = await request(app)
        .post('/auth/login')
        .send(loginData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should handle internal server errors', async () => {
      // Arrange
      mockLogin.mockRejectedValue(new Error('Database error'));

      // Act
      const response = await request(app)
        .post('/auth/login')
        .send({ userName: 'test', password: 'pass' });

      // Assert
      expect(response.status).toBe(500);
    });
  });

  describe('POST /auth/signup', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const signupData = {
        userName: 'newuser',
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User'
      };

      const mockResponse = {
        status: 201,
        resBody: {
          success: true,
          data: signupData
        }
      };

      mockSignUp.mockResolvedValue(mockResponse);

      // Act
      const response = await request(app)
        .post('/auth/signup')
        .send(signupData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should return 409 when user already exists', async () => {
      // Arrange
      const signupData = {
        userName: 'existinguser',
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'Existing',
        lastName: 'User'
      };

      const mockResponse = {
        status: 409,
        resBody: {
          success: false,
          data: 'User already exist!'
        }
      };

      mockSignUp.mockResolvedValue(mockResponse);

      // Act
      const response = await request(app)
        .post('/auth/signup')
        .send(signupData);

      // Assert
      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /auth/profile', () => {
    it('should return profile message', async () => {
      // Act
      const response = await request(app)
        .get('/auth/profile')
        .set('Authorization', 'Bearer test-token');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('You made it to the secure route');
    });
  });
});
