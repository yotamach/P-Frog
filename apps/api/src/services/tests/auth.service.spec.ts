/**
 * Backend Integration Tests for Authentication Service
 */

import { AuthService } from '../auth.service';
import { User } from '../../schemas/user.schema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import HttpStatus from 'http-status-codes';
import { Types } from 'mongoose';

// Mock dependencies
jest.mock('../../schemas/user.schema');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;
  const mockUserId = new Types.ObjectId().toString();

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('SignUp', () => {
    const mockUserData = {
      userName: 'testuser',
      password: 'password123',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
    };

    it('should successfully create a new user', async () => {
      // Arrange
      const mockExec = jest.fn().mockResolvedValue(null);
      (User.findOne as jest.Mock) = jest.fn().mockReturnValue({ exec: mockExec });
      (bcrypt.genSaltSync as jest.Mock) = jest.fn().mockReturnValue('salt');
      (bcrypt.hashSync as jest.Mock) = jest.fn().mockReturnValue('hashedPassword');
      (jwt.sign as jest.Mock) = jest.fn().mockReturnValue('test-token');

      const mockCreatedUser = {
        _id: mockUserId,
        ...mockUserData,
        password: 'hashedPassword',
        token: '',
        save: jest.fn().mockResolvedValue(true),
      };
      (User.create as jest.Mock) = jest.fn().mockResolvedValue(mockCreatedUser);

      // Act
      const result = await authService.SignUp(mockUserData as any);

      // Assert
      expect(result.status).toBe(HttpStatus.CREATED);
      expect(result.resBody.success).toBe(true);
      expect(User.findOne).toHaveBeenCalledWith({ userName: mockUserData.userName });
      expect(bcrypt.genSaltSync).toHaveBeenCalledWith(10);
      expect(bcrypt.hashSync).toHaveBeenCalledWith(mockUserData.password, 'salt');
      expect(User.create).toHaveBeenCalledWith({
        ...mockUserData,
        password: 'hashedPassword',
      });
    });

    it('should return CONFLICT if user already exists', async () => {
      const mockExec = jest.fn().mockResolvedValue({ userName: 'testuser' });
      (User.findOne as jest.Mock) = jest.fn().mockReturnValue({ exec: mockExec });

      const result = await authService.SignUp(mockUserData as any);

      expect(result.status).toBe(HttpStatus.CONFLICT);
      expect(result.resBody.success).toBe(false);
      expect(result.resBody.data).toBe('User already exist!');
    });

    it('should create new user with encrypted password', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      (User.findOne as jest.Mock) = jest.fn().mockReturnValue({ exec: mockExec });
      (bcrypt.genSaltSync as jest.Mock) = jest.fn().mockReturnValue('salt');
      (bcrypt.hashSync as jest.Mock) = jest.fn().mockReturnValue('hashedPassword');
      (jwt.sign as jest.Mock) = jest.fn().mockReturnValue('token123');

      const mockCreatedUser = {
        _id: mockUserId,
        ...mockUserData,
        password: 'hashedPassword',
        token: '',
        save: jest.fn().mockResolvedValue(true),
      };
      (User.create as jest.Mock) = jest.fn().mockResolvedValue(mockCreatedUser);

      const result = await authService.SignUp(mockUserData as any);

      expect(bcrypt.genSaltSync).toHaveBeenCalledWith(10);
      expect(bcrypt.hashSync).toHaveBeenCalledWith('password123', 'salt');
      expect(User.create).toHaveBeenCalledWith({
        ...mockUserData,
        password: 'hashedPassword',
      });
      expect(result.status).toBe(HttpStatus.CREATED);
      expect(result.resBody.success).toBe(true);
    });

    it('should generate JWT token for new user', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      (User.findOne as jest.Mock) = jest.fn().mockReturnValue({ exec: mockExec });
      (bcrypt.genSaltSync as jest.Mock) = jest.fn().mockReturnValue('salt');
      (bcrypt.hashSync as jest.Mock) = jest.fn().mockReturnValue('hashedPassword');
      (jwt.sign as jest.Mock) = jest.fn().mockReturnValue('token123');

      const mockCreatedUser = {
        _id: mockUserId,
        ...mockUserData,
        password: 'hashedPassword',
        token: '',
        save: jest.fn().mockResolvedValue(true),
      };
      (User.create as jest.Mock) = jest.fn().mockResolvedValue(mockCreatedUser);

      await authService.SignUp(mockUserData as any);

      expect(jwt.sign).toHaveBeenCalledWith(
        { user_id: mockUserId, userName: 'testuser' },
        expect.any(String),
        { expiresIn: '2h' }
      );
      expect(mockCreatedUser.save).toHaveBeenCalled();
    });

    it('should handle errors during signup', async () => {
      (User.findOne as jest.Mock) = jest.fn().mockImplementation(() => {
        throw new Error('Database error');
      });

      const result = await authService.SignUp(mockUserData as any);

      expect(result.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.resBody.success).toBe(false);
    });
  });

  describe('Login', () => {
    const mockLoginData = {
      userName: 'testuser',
      password: 'password123',
    };

    const mockUser = {
      _id: mockUserId,
      userName: 'testuser',
      email: 'test@example.com',
      password: 'hashedPassword',
      token: '',
      save: jest.fn(),
      toJSON: jest.fn().mockReturnValue({ _id: mockUserId, userName: 'testuser', email: 'test@example.com', token: '' }),
    };

    it('should return NOT_FOUND if username or password is missing', async () => {
      const result = await authService.Login({ userName: 'testuser' });

      expect(result.status).toBe(HttpStatus.NOT_FOUND);
      expect(result.resBody.success).toBe(false);
      expect(result.resBody.data).toBe('username or password missing!');
    });

    it('should return error when password is missing', async () => {
      const result = await authService.Login({ userName: 'user', password: '' });

      expect(result.status).toBe(HttpStatus.NOT_FOUND);
      expect(result.resBody.success).toBe(false);
      expect(result.resBody.data).toBe('username or password missing!');
    });

    it('should successfully login with valid credentials (username)', async () => {
      const mockExec = jest.fn().mockResolvedValue(mockUser);
      (User.findOne as jest.Mock) = jest.fn().mockReturnValue({ exec: mockExec });
      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(true);
      (jwt.sign as jest.Mock) = jest.fn().mockReturnValue('token123');

      const result = await authService.Login(mockLoginData);

      expect(User.findOne).toHaveBeenCalledWith({
        $or: [{ userName: mockLoginData.userName }, { email: mockLoginData.userName }]
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(jwt.sign).toHaveBeenCalledWith(
        { user_id: mockUserId, userName: 'testuser' },
        expect.any(String),
        { expiresIn: '2h' }
      );
      expect(result.status).toBe(HttpStatus.OK);
      expect(result.resBody.success).toBe(true);
      expect(result.resBody.data.token).toBe('token123');
    });

    it('should successfully login with email instead of username', async () => {
      const emailLogin = { userName: 'test@example.com', password: 'password123' };
      const mockExec = jest.fn().mockResolvedValue(mockUser);
      (User.findOne as jest.Mock) = jest.fn().mockReturnValue({ exec: mockExec });
      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(true);
      (jwt.sign as jest.Mock) = jest.fn().mockReturnValue('new-token');

      const result = await authService.Login(emailLogin);

      expect(result.status).toBe(HttpStatus.OK);
      expect(result.resBody.success).toBe(true);
      expect(result.resBody.data.token).toBe('new-token');
    });

    it('should return error when user is not found', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      (User.findOne as jest.Mock) = jest.fn().mockReturnValue({ exec: mockExec });

      const result = await authService.Login(mockLoginData);

      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.resBody.success).toBe(false);
      expect(result.resBody.data).toBe('Invalid Credentials!');
    });

    it('should return BAD_REQUEST for invalid password', async () => {
      const mockExec = jest.fn().mockResolvedValue(mockUser);
      (User.findOne as jest.Mock) = jest.fn().mockReturnValue({ exec: mockExec });
      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(false);

      const result = await authService.Login(mockLoginData);

      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.resBody.success).toBe(false);
      expect(result.resBody.data).toBe('Invalid Credentials!');
    });

    it('should handle database errors', async () => {
      (User.findOne as jest.Mock) = jest.fn().mockImplementation(() => {
        throw new Error('Database error');
      });

      const result = await authService.Login(mockLoginData);

      expect(result.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.resBody.success).toBe(false);
    });
  });
});
