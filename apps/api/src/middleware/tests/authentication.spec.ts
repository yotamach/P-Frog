import HttpStatus from 'http-status-codes';

jest.mock('better-auth/node', () => ({
  fromNodeHeaders: jest.fn((headers) => headers),
}));

jest.mock('tslog', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
    info: jest.fn(),
  })),
}));

import { auth, setAuthInstance } from '../authentication';

const makeResponse = () => ({
  status: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
});

describe('Authentication Middleware', () => {
  let mockRequest: any;
  let mockResponse: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = { headers: {}, body: {}, query: {} };
    mockResponse = makeResponse();
    mockNext = jest.fn();
    // Reset auth instance before each test
    setAuthInstance(null as any);
    jest.clearAllMocks();
  });

  describe('when auth instance is not initialized', () => {
    it('should return 500 Auth not configured', async () => {
      await auth(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.send).toHaveBeenCalledWith({
        success: false,
        data: 'Auth not configured',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('when auth instance is initialized', () => {
    let mockGetSession: jest.Mock;
    let mockAuth: any;

    beforeEach(() => {
      mockGetSession = jest.fn();
      mockAuth = { api: { getSession: mockGetSession } };
      setAuthInstance(mockAuth);
    });

    it('should return 401 when no valid session exists', async () => {
      mockGetSession.mockResolvedValue(null);

      await auth(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(mockResponse.send).toHaveBeenCalledWith({
        success: false,
        data: 'Unauthorized: No valid session',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should attach user and session to request and call next when session is valid', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com', role: 'member' };
      const mockSession = { id: 'session-abc', userId: 'user-123' };
      mockGetSession.mockResolvedValue({ user: mockUser, session: mockSession });

      await auth(mockRequest, mockResponse, mockNext);

      expect(mockRequest.user).toEqual(mockUser);
      expect(mockRequest.session_data).toEqual(mockSession);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should pass request headers to getSession', async () => {
      mockRequest.headers = { cookie: 'session=abc123' };
      mockGetSession.mockResolvedValue(null);

      await auth(mockRequest, mockResponse, mockNext);

      expect(mockGetSession).toHaveBeenCalledWith({
        headers: mockRequest.headers,
      });
    });

    it('should return 401 when getSession throws an error', async () => {
      mockGetSession.mockRejectedValue(new Error('DB connection error'));

      await auth(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(mockResponse.send).toHaveBeenCalledWith({
        success: false,
        data: 'Unauthorized',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should preserve other request properties when authenticated', async () => {
      const mockUser = { id: 'user-789', email: 'user@example.com' };
      mockRequest.body = { someData: 'important' };
      mockRequest.params = { id: '456' };
      mockGetSession.mockResolvedValue({ user: mockUser, session: {} });

      await auth(mockRequest, mockResponse, mockNext);

      expect(mockRequest.body.someData).toBe('important');
      expect(mockRequest.params.id).toBe('456');
      expect(mockRequest.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
