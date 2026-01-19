import { SettingsService } from '../settings.service';
import { Settings } from '../../schemas/settings.schema';
import { Types } from 'mongoose';

jest.mock('../../schemas/settings.schema');

describe('SettingsService', () => {
  let settingsService: SettingsService;
  let mockSettingsId: string;
  let mockUserId: string;

  beforeEach(() => {
    settingsService = new SettingsService();
    mockSettingsId = new Types.ObjectId().toString();
    mockUserId = new Types.ObjectId().toString();
    jest.clearAllMocks();
  });

  describe('getSettingsByParams', () => {
    it('should call Settings.find with params and callback', () => {
      const mockParams = { user_id: mockUserId };
      const mockCallback = jest.fn();
      (Settings.find as jest.Mock) = jest.fn();

      settingsService.getSettingsByParams(mockParams, mockCallback);

      expect(Settings.find).toHaveBeenCalledWith(mockParams, mockCallback);
    });
  });

  describe('createSettings', () => {
    it('should create new settings', async () => {
      const mockSettingsData = {
        email: 'test@example.com',
        phone: '+1234567890',
        address: '123 Main St',
        city: 'New York',
        country: 'USA',
        sendTasksEmail: true,
      };

      const mockCreatedSettings = { ...mockSettingsData, _id: mockSettingsId };
      (Settings.create as jest.Mock) = jest.fn().mockResolvedValue(mockCreatedSettings);

      const result = await settingsService.createSettings(mockSettingsData);

      expect(Settings.create).toHaveBeenCalledWith(mockSettingsData);
      expect(result).toEqual(mockCreatedSettings);
    });
  });

  describe('updateSettings', () => {
    it('should call findOneAndUpdate with correct parameters', () => {
      const mockSettingsData = {
        email: 'updated@example.com',
        phone: '+9876543210',
        address: '456 Oak Ave',
        city: 'Los Angeles',
        country: 'USA',
        sendTasksEmail: false,
      };
      const mockCallback = jest.fn();
      (Settings.findOneAndUpdate as jest.Mock) = jest.fn();

      settingsService.updateSettings(mockSettingsData, mockSettingsId, mockCallback);

      expect(Settings.findOneAndUpdate).toHaveBeenCalledWith(
        { id: mockSettingsId },
        { ...mockSettingsData },
        { new: true },
        mockCallback
      );
    });
  });

  describe('deleteSettings', () => {
    it('should call findByIdAndDelete with settings id', () => {
      const mockCallback = jest.fn();
      (Settings.findByIdAndDelete as jest.Mock) = jest.fn();

      settingsService.deleteSettings(mockSettingsId, mockCallback);

      expect(Settings.findByIdAndDelete).toHaveBeenCalledWith(mockSettingsId, mockCallback);
    });
  });
});
