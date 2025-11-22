import { Task } from '../task.schema';

describe('Task Schema', () => {
  describe('Schema Definition', () => {
    it('should have required fields', () => {
      const taskSchema = Task.schema;
      const requiredFields = ['title', 'description', 'startDate', 'endDate'];

      requiredFields.forEach((field) => {
        expect(taskSchema.path(field).isRequired).toBe(true);
      });
    });

    it('should have correct field types', () => {
      const taskSchema = Task.schema;

      expect(taskSchema.path('title').instance).toBe('String');
      expect(taskSchema.path('description').instance).toBe('String');
      expect(taskSchema.path('startDate').instance).toBe('Date');
      expect(taskSchema.path('endDate').instance).toBe('Date');
    });

    it('should have default value for description', () => {
      const taskSchema = Task.schema;
      const descriptionPath = taskSchema.path('description') as any;
      expect(descriptionPath.defaultValue).toBe('N/A');
    });
  });

  describe('Model Creation', () => {
    it('should create a valid task instance', () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
      };

      const task = new Task(taskData);

      expect(task.title).toBe(taskData.title);
      expect(task.description).toBe(taskData.description);
      expect(task.startDate).toEqual(taskData.startDate);
      expect(task.endDate).toEqual(taskData.endDate);
    });

    it('should use default description when not provided', () => {
      const taskData = {
        title: 'Test Task',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
      };

      const task = new Task(taskData);

      expect(task.description).toBe('N/A');
    });
  });

  describe('Validation', () => {
    it('should fail validation when required fields are missing', () => {
      const task = new Task({});
      const validationError = task.validateSync();

      expect(validationError).toBeDefined();
      expect(validationError?.errors.title).toBeDefined();
      expect(validationError?.errors.startDate).toBeDefined();
      expect(validationError?.errors.endDate).toBeDefined();
    });

    it('should pass validation with all required fields', () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
      };

      const task = new Task(taskData);
      const validationError = task.validateSync();

      expect(validationError).toBeUndefined();
    });

    it('should validate date types', () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        startDate: 'invalid-date' as any,
        endDate: new Date('2024-01-31'),
      };

      const task = new Task(taskData);
      const validationError = task.validateSync();

      expect(validationError).toBeDefined();
    });
  });

  describe('toJSON Transformation', () => {
    it('should transform _id to id and remove _id and __v', () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
      };

      const task = new Task(taskData);
      const json = task.toJSON();

      expect(json.id).toBeDefined();
      expect(json._id).toBeUndefined();
      expect(json.__v).toBeUndefined();
    });
  });
});
