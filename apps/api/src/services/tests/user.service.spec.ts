import { UserService } from '../user.service';
import { User } from '../../schemas/user.schema';
import { Types } from 'mongoose';

jest.mock('../../schemas/user.schema');

describe('UserService', () => {
  let userService: UserService;
  let mockUserId: string;

  beforeEach(() => {
    userService = new UserService();
    mockUserId = new Types.ObjectId().toString();
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should call User.find with callback', () => {
      const mockCallback = jest.fn();
      (User.find as jest.Mock) = jest.fn();

      userService.getUsers(mockCallback);

      expect(User.find).toHaveBeenCalledWith(mockCallback);
    });
  });

  describe('getUserByParams', () => {
    it('should call User.find with params and callback', () => {
      const mockParams = { userName: 'testuser' };
      const mockCallback = jest.fn();
      (User.find as jest.Mock) = jest.fn();

      userService.getUserByParams(mockParams, mockCallback);

      expect(User.find).toHaveBeenCalledWith(mockParams, mockCallback);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const mockUserData = {
        userName: 'testuser',
        password: 'password123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };

      const mockCreatedUser = { ...mockUserData, _id: mockUserId };
      (User.create as jest.Mock) = jest.fn().mockResolvedValue(mockCreatedUser);

      const result = await userService.createUser(mockUserData);

      expect(User.create).toHaveBeenCalledWith(mockUserData);
      expect(result).toEqual(mockCreatedUser);
    });
  });

  describe('updateUser', () => {
    it('should call findOneAndUpdate with correct parameters', () => {
      const mockUserData = {
        userName: 'updateduser',
        password: 'newpassword123',
        email: 'updated@example.com',
        firstName: 'Updated',
        lastName: 'User',
      };
      const mockCallback = jest.fn();
      (User.findOneAndUpdate as jest.Mock) = jest.fn();

      userService.updateUser(mockUserData, mockUserId, mockCallback);

      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { id: mockUserId },
        { ...mockUserData },
        { new: true },
        mockCallback
      );
    });
  });

  describe('deleteUser', () => {
    it('should call findByIdAndDelete with user id', () => {
      const mockCallback = jest.fn();
      (User.findByIdAndDelete as jest.Mock) = jest.fn();

      userService.deleteUser(mockUserId, mockCallback);

      expect(User.findByIdAndDelete).toHaveBeenCalledWith(mockUserId, mockCallback);
    });
  });
});
