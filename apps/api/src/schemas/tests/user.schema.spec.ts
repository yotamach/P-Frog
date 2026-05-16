import { User } from '../user.schema';

describe('User Schema', () => {
  describe('Schema Definition', () => {
    it('should have required fields', () => {
      const userSchema = User.schema;
      const requiredFields = ['email', 'password', 'firstName', 'lastName'];

      requiredFields.forEach((field) => {
        expect(userSchema.path(field).isRequired).toBe(true);
      });
    });

    it('should have optional userName field', () => {
      const userSchema = User.schema;
      expect(userSchema.path('userName')).toBeDefined();
      expect(userSchema.path('userName').isRequired).toBeFalsy();
    });

    it('should not have token field (removed — sessions managed by better-auth)', () => {
      const userSchema = User.schema;
      expect(userSchema.path('token')).toBeUndefined();
    });

    it('should have correct field types', () => {
      const userSchema = User.schema;

      expect(userSchema.path('email').instance).toBe('String');
      expect(userSchema.path('password').instance).toBe('String');
      expect(userSchema.path('firstName').instance).toBe('String');
      expect(userSchema.path('lastName').instance).toBe('String');
      expect(userSchema.path('userName').instance).toBe('String');
    });
  });

  describe('Model Creation', () => {
    it('should create a valid user instance', () => {
      const userData = {
        email: 'test@example.com',
        password: 'hashedPassword123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const user = new User(userData);

      expect(user.email).toBe(userData.email);
      expect(user.password).toBe(userData.password);
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
    });

    it('should default userName to email when not provided', () => {
      const userData = {
        email: 'test@example.com',
        password: 'hashedPassword123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const user = new User(userData);
      expect(user.userName).toBe(userData.email);
    });
  });

  describe('Validation', () => {
    it('should fail validation when required fields are missing', () => {
      const user = new User({});
      const validationError = user.validateSync();

      expect(validationError).toBeDefined();
      expect(validationError?.errors.email).toBeDefined();
      expect(validationError?.errors.password).toBeDefined();
      expect(validationError?.errors.firstName).toBeDefined();
      expect(validationError?.errors.lastName).toBeDefined();
      // userName is now optional
      expect(validationError?.errors.userName).toBeUndefined();
    });

    it('should pass validation with all required fields', () => {
      const userData = {
        email: 'test@example.com',
        password: 'hashedPassword123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const user = new User(userData);
      const validationError = user.validateSync();

      expect(validationError).toBeUndefined();
    });
  });
});
