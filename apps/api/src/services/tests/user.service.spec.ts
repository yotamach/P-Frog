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
    it('should return all users', async () => {
      const mockUsers = [{ userName: 'testuser' }];
      const mockExec = jest.fn().mockResolvedValue(mockUsers);
      (User.find as jest.Mock) = jest.fn().mockReturnValue({ exec: mockExec });

      const result = await userService.getUsers();

      expect(User.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockUsers);
    });
  });

  describe('getUserByParams', () => {
    it('should call User.find with params and return results', async () => {
      const mockParams = { userName: 'testuser' };
      const mockUsers = [{ userName: 'testuser' }];
      const mockExec = jest.fn().mockResolvedValue(mockUsers);
      (User.find as jest.Mock) = jest.fn().mockReturnValue({ exec: mockExec });

      const result = await userService.getUserByParams(mockParams);

      expect(User.find).toHaveBeenCalledWith(mockParams);
      expect(result).toEqual(mockUsers);
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
    it('should call findOneAndUpdate with correct parameters', async () => {
      const mockUserData = {
        userName: 'updateduser',
        password: 'newpassword123',
        email: 'updated@example.com',
        firstName: 'Updated',
        lastName: 'User',
      };
      const mockUpdated = { ...mockUserData, _id: mockUserId };
      const mockExec = jest.fn().mockResolvedValue(mockUpdated);
      (User.findOneAndUpdate as jest.Mock) = jest.fn().mockReturnValue({ exec: mockExec });

      const result = await userService.updateUser(mockUserData, mockUserId);

      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { id: mockUserId },
        { ...mockUserData },
        { new: true }
      );
      expect(result).toEqual(mockUpdated);
    });
  });

  describe('deleteUser', () => {
    it('should call findByIdAndDelete with user id', async () => {
      const mockDeleted = { _id: mockUserId };
      const mockExec = jest.fn().mockResolvedValue(mockDeleted);
      (User.findByIdAndDelete as jest.Mock) = jest.fn().mockReturnValue({ exec: mockExec });

      const result = await userService.deleteUser(mockUserId);

      expect(User.findByIdAndDelete).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockDeleted);
    });
  });
});
