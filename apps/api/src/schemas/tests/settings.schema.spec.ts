import { Settings } from '../settings.schema';

describe('Settings Schema', () => {
  describe('Schema Definition', () => {
    it('should have required fields', () => {
      const settingsSchema = Settings.schema;
      const requiredFields = ['email', 'phone', 'address', 'city', 'country'];

      requiredFields.forEach((field) => {
        expect(settingsSchema.path(field).isRequired).toBe(true);
      });
    });

    it('should have optional user reference field', () => {
      const settingsSchema = Settings.schema;
      expect(settingsSchema.path('user')).toBeDefined();
    });

    it('should have correct field types', () => {
      const settingsSchema = Settings.schema;

      expect(settingsSchema.path('email').instance).toBe('String');
      expect(settingsSchema.path('phone').instance).toBe('String');
      expect(settingsSchema.path('address').instance).toBe('String');
      expect(settingsSchema.path('city').instance).toBe('String');
      expect(settingsSchema.path('country').instance).toBe('String');
      expect(settingsSchema.path('sendTasksEmail').instance).toBe('Boolean');
      expect(settingsSchema.path('user').instance).toBe('ObjectId');
    });

    it('should have default value for sendTasksEmail', () => {
      const settingsSchema = Settings.schema;
      const sendTasksEmailPath = settingsSchema.path('sendTasksEmail') as any;
      expect(sendTasksEmailPath.defaultValue).toBe(false);
    });

    it('should have user reference to user model', () => {
      const settingsSchema = Settings.schema;
      const userPath = settingsSchema.path('user') as any;
      expect(userPath.options.ref).toBe('user');
    });
  });

  describe('Model Creation', () => {
    it('should create a valid settings instance', () => {
      const settingsData = {
        email: 'user@example.com',
        phone: '+1234567890',
        address: '123 Main St',
        city: 'New York',
        country: 'USA',
      };

      const settings = new Settings(settingsData);

      expect(settings.email).toBe(settingsData.email);
      expect(settings.phone).toBe(settingsData.phone);
      expect(settings.address).toBe(settingsData.address);
      expect(settings.city).toBe(settingsData.city);
      expect(settings.country).toBe(settingsData.country);
    });

    it('should use default sendTasksEmail when not provided', () => {
      const settingsData = {
        email: 'user@example.com',
        phone: '+1234567890',
        address: '123 Main St',
        city: 'New York',
        country: 'USA',
      };

      const settings = new Settings(settingsData);

      expect(settings.sendTasksEmail).toBe(false);
    });

    it('should create settings with sendTasksEmail enabled', () => {
      const settingsData = {
        email: 'user@example.com',
        phone: '+1234567890',
        address: '123 Main St',
        city: 'New York',
        country: 'USA',
        sendTasksEmail: true,
      };

      const settings = new Settings(settingsData);

      expect(settings.sendTasksEmail).toBe(true);
    });
  });

  describe('Validation', () => {
    it('should fail validation when required fields are missing', () => {
      const settings = new Settings({});
      const validationError = settings.validateSync();

      expect(validationError).toBeDefined();
      expect(validationError?.errors.email).toBeDefined();
      expect(validationError?.errors.phone).toBeDefined();
      expect(validationError?.errors.address).toBeDefined();
      expect(validationError?.errors.city).toBeDefined();
      expect(validationError?.errors.country).toBeDefined();
    });

    it('should pass validation with all required fields', () => {
      const settingsData = {
        email: 'user@example.com',
        phone: '+1234567890',
        address: '123 Main St',
        city: 'New York',
        country: 'USA',
      };

      const settings = new Settings(settingsData);
      const validationError = settings.validateSync();

      expect(validationError).toBeUndefined();
    });

    it('should validate boolean type for sendTasksEmail', () => {
      const settingsData = {
        email: 'user@example.com',
        phone: '+1234567890',
        address: '123 Main St',
        city: 'New York',
        country: 'USA',
        sendTasksEmail: 'invalid' as any,
      };

      const settings = new Settings(settingsData);
      const validationError = settings.validateSync();

      expect(validationError).toBeDefined();
    });
  });
});
