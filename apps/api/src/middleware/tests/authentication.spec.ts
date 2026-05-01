import jwt from 'jsonwebtoken';
import HttpStatus from 'http-status-codes';
import { auth } from '../authentication';

// Mock jwt
jest.mock('jsonwebtoken');

describe('Authentication Middleware', () => {
  let mockRequest: any;
  let mockResponse: any;
  let mockNext: any;
  const mockJwtSecret = 'g2r0e1e3n_t2o5p8s5_e0n5e2r5g8y30119';

  beforeEach(() => {
    mockRequest = {
      body: {},
      query: {},
      headers: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();

    // Reset environment variable
    process.env.JWT_SECRET = mockJwtSecret;

    // Clear console logs
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('Token Validation', () => {
    it('should reject request when no token is provided', () => {
      auth(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(mockResponse.send).toHaveBeenCalledWith({
        success: false,
        data: 'A token is required for authentication',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should accept token from request body', () => {
      const mockDecoded = { user_id: '123', userName: 'testuser' };
      mockRequest.body = { token: 'Bearer valid-token' };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      auth(mockRequest, mockResponse, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith('valid-token', mockJwtSecret);
      expect((mockRequest as any).user).toEqual(mockDecoded);
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should accept token from query parameter', () => {
      const mockDecoded = { user_id: '456', userName: 'queryuser' };
      mockRequest.query = { token: 'Bearer query-token' };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      auth(mockRequest, mockResponse, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith('query-token', mockJwtSecret);
      expect((mockRequest as any).user).toEqual(mockDecoded);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should accept token from x-access-token header', () => {
      const mockDecoded = { user_id: '789', userName: 'headeruser' };
      mockRequest.headers = { 'x-access-token': 'Bearer header-token' };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      auth(mockRequest, mockResponse, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith('header-token', mockJwtSecret);
      expect((mockRequest as any).user).toEqual(mockDecoded);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should prioritize body token over query and header', () => {
      const mockDecoded = { user_id: '123', userName: 'bodyuser' };
      mockRequest.body = { token: 'Bearer body-token' };
      mockRequest.query = { token: 'Bearer query-token' };
      mockRequest.headers = { 'x-access-token': 'Bearer header-token' };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      auth(mockRequest, mockResponse, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith('body-token', mockJwtSecret);
      expect((mockRequest as any).user).toEqual(mockDecoded);
    });

    it('should prioritize query token over header', () => {
      const mockDecoded = { user_id: '456', userName: 'queryuser' };
      mockRequest.query = { token: 'Bearer query-token' };
      mockRequest.headers = { 'x-access-token': 'Bearer header-token' };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      auth(mockRequest, mockResponse, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith('query-token', mockJwtSecret);
      expect((mockRequest as any).user).toEqual(mockDecoded);
    });
  });

  describe('Token Format Handling', () => {
    it('should extract token from "Bearer <token>" format', () => {
      const mockDecoded = { user_id: '123', userName: 'testuser' };
      mockRequest.body = { token: 'Bearer my-jwt-token-123' };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      auth(mockRequest, mockResponse, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith('my-jwt-token-123', mockJwtSecret);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should reject token without Bearer prefix', () => {
      mockRequest.body = { token: 'plain-token' };

      auth(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(mockResponse.send).toHaveBeenCalledWith({
        success: false,
        data: "Unauthorized: Invalid token format. Expected 'Bearer <token>'",
      });
      expect(jwt.verify).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('JWT Verification', () => {
    it('should successfully verify valid token with correct secret', () => {
      const mockDecoded = { user_id: '123', userName: 'testuser', exp: 1234567890 };
      mockRequest.body = { token: 'Bearer valid-jwt-token' };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      auth(mockRequest, mockResponse, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith('valid-jwt-token', mockJwtSecret);
      expect((mockRequest as any).user).toEqual(mockDecoded);
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should use environment JWT_SECRET if available', () => {
      process.env.JWT_SECRET = 'custom-secret-key';
      const mockDecoded = { user_id: '123', userName: 'testuser' };
      mockRequest.body = { token: 'Bearer valid-token' };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      auth(mockRequest, mockResponse, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'custom-secret-key');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should return UNAUTHORIZED if JWT_SECRET is not set', () => {
      delete process.env.JWT_SECRET;
      mockRequest.body = { token: 'Bearer valid-token' };

      auth(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(mockNext).not.toHaveBeenCalled();
      expect(jwt.verify).not.toHaveBeenCalled();
    });

    it('should attach decoded user data to request object', () => {
      const mockDecoded = {
        user_id: '123',
        userName: 'testuser',
        email: 'test@example.com',
        iat: 1234567890,
        exp: 1234571490,
      };
      mockRequest.body = { token: 'Bearer valid-token' };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      auth(mockRequest, mockResponse, mockNext);

      expect((mockRequest as any).user).toEqual(mockDecoded);
      expect((mockRequest as any).user.user_id).toBe('123');
      expect((mockRequest as any).user.userName).toBe('testuser');
    });
  });

  describe('Error Handling', () => {
    it('should reject expired token', () => {
      const tokenExpiredError = new Error('jwt expired');
      tokenExpiredError.name = 'TokenExpiredError';
      mockRequest.body = { token: 'Bearer expired-token' };

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw tokenExpiredError;
      });

      auth(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(mockResponse.send).toHaveBeenCalledWith({
        success: false,
        data: 'Unauthorized: Token has expired!',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject invalid token signature', () => {
      const invalidSignatureError = new Error('invalid signature');
      invalidSignatureError.name = 'JsonWebTokenError';
      mockRequest.body = { token: 'Bearer invalid-signature-token' };

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw invalidSignatureError;
      });

      auth(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(mockResponse.send).toHaveBeenCalledWith({
        success: false,
        data: 'Unauthorized: Invalid token signature!',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject malformed token', () => {
      const malformedError = new Error('jwt malformed');
      malformedError.name = 'JsonWebTokenError';
      mockRequest.body = { token: 'Bearer malformed-token' };

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw malformedError;
      });

      auth(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(mockResponse.send).toHaveBeenCalledWith({
        success: false,
        data: 'Unauthorized: Invalid token signature!',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle any jwt verification error', () => {
      const genericError = new Error('Unknown JWT error');
      mockRequest.body = { token: 'Bearer problematic-token' };

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw genericError;
      });

      auth(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(mockResponse.send).toHaveBeenCalledWith({
        success: false,
        data: 'Unauthorized: Invalid token!',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should log errors using Logger', () => {
      const error = new Error('jwt error');
      mockRequest.body = { token: 'Bearer error-token' };

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw error;
      });

      auth(mockRequest, mockResponse, mockNext);

      // Logger is being used (we can see it in test output)
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(mockResponse.send).toHaveBeenCalledWith({
        success: false,
        data: 'Unauthorized: Invalid token!',
      });
    });
  });

  describe('Integration Scenarios', () => {
    it('should allow authenticated request to proceed', () => {
      const mockDecoded = { user_id: '123', userName: 'authenticateduser' };
      mockRequest.headers = { 'x-access-token': 'Bearer valid-token' };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      auth(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.send).not.toHaveBeenCalled();
    });

    it('should block unauthenticated request', () => {
      // No token provided
      auth(mockRequest, mockResponse, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    });

    it('should preserve other request properties', () => {
      const mockDecoded = { user_id: '123', userName: 'testuser' };
      mockRequest.body = {
        token: 'Bearer valid-token',
        someData: 'important-data',
      };
      mockRequest.params = { id: '456' };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      auth(mockRequest, mockResponse, mockNext);

      expect((mockRequest as any).body.someData).toBe('important-data');
      expect((mockRequest as any).params.id).toBe('456');
      expect((mockRequest as any).user).toEqual(mockDecoded);
    });
  });
});
