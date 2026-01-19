import { AuthService } from '../auth.service';
import { User } from '../../schemas/user.schema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import HttpStatus from 'http-status-codes';
import { Types } from 'mongoose';

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

    it('should return INTERNAL_SERVER_ERROR on error', async () => {
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

    it('should return NOT_FOUND if username or password is missing', async () => {
      const result = await authService.Login({ userName: 'testuser' });

      expect(result.status).toBe(HttpStatus.NOT_FOUND);
      expect(result.resBody.success).toBe(false);
      expect(result.resBody.data).toBe('username or password missing!');
    });

    it('should return OK with token for valid credentials', async () => {
      const mockUser = {
        _id: mockUserId,
        userName: 'testuser',
        password: 'hashedPassword',
        token: '',
      };

      const mockExec = jest.fn().mockResolvedValue(mockUser);
      (User.findOne as jest.Mock) = jest.fn().mockReturnValue({ exec: mockExec });
      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(true);
      (jwt.sign as jest.Mock) = jest.fn().mockReturnValue('token123');

      const result = await authService.Login(mockLoginData);

      expect(User.findOne).toHaveBeenCalledWith({ userName: 'testuser' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(jwt.sign).toHaveBeenCalledWith(
        { user_id: mockUserId, userName: 'testuser' },
        expect.any(String),
        { expiresIn: '2h' }
      );
      expect(result.status).toBe(HttpStatus.OK);
      expect(result.resBody.success).toBe(true);
    });

    it('should return BAD_REQUEST for invalid password', async () => {
      const mockUser = {
        _id: mockUserId,
        userName: 'testuser',
        password: 'hashedPassword',
      };

      const mockExec = jest.fn().mockResolvedValue(mockUser);
      (User.findOne as jest.Mock) = jest.fn().mockReturnValue({ exec: mockExec });
      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(false);

      const result = await authService.Login(mockLoginData);

      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.resBody.success).toBe(false);
      expect(result.resBody.data).toBe('Invalid Credentials!');
    });

    it('should return INTERNAL_SERVER_ERROR on error', async () => {
      (User.findOne as jest.Mock) = jest.fn().mockImplementation(() => {
        throw new Error('Database error');
      });

      const result = await authService.Login(mockLoginData);

      expect(result.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.resBody.success).toBe(false);
    });
  });
});
