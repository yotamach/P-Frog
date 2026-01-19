import { Project, ProjectPriority } from '../project.schema';
import { Types } from 'mongoose';

describe('Project Schema', () => {
  describe('Schema Definition', () => {
    it('should have required fields', () => {
      const projectSchema = Project.schema;
      const requiredFields = ['title', 'description', 'dueDate', 'priority', 'owner', 'created_by'];

      requiredFields.forEach((field) => {
        expect(projectSchema.path(field).isRequired).toBe(true);
      });
    });

    it('should have correct field types', () => {
      const projectSchema = Project.schema;

      expect(projectSchema.path('title').instance).toBe('String');
      expect(projectSchema.path('description').instance).toBe('String');
      expect(projectSchema.path('dueDate').instance).toBe('Date');
      expect(projectSchema.path('priority').instance).toBe('String');
    });

    it('should have default value for description', () => {
      const projectSchema = Project.schema;
      const descriptionPath = projectSchema.path('description') as any;
      expect(descriptionPath.defaultValue).toBe('N/A');
    });

    it('should have default value for priority', () => {
      const projectSchema = Project.schema;
      const priorityPath = projectSchema.path('priority') as any;
      expect(priorityPath.defaultValue).toBe(ProjectPriority.MEDIUM);
    });

    it('should validate priority enum values', () => {
      const projectSchema = Project.schema;
      const priorityPath = projectSchema.path('priority') as any;
      const enumValues = priorityPath.enumValues;
      
      expect(enumValues).toContain(ProjectPriority.LOW);
      expect(enumValues).toContain(ProjectPriority.MEDIUM);
      expect(enumValues).toContain(ProjectPriority.HIGH);
      expect(enumValues).toContain(ProjectPriority.CRITICAL);
    });
  });

  describe('Model Creation', () => {
    it('should create a valid project instance', () => {
      const userId = new Types.ObjectId();
      const projectData = {
        title: 'Test Project',
        description: 'Test Description',
        dueDate: new Date('2024-12-31'),
        priority: ProjectPriority.HIGH,
        owner: userId,
        created_by: userId,
      };

      const project = new Project(projectData);

      expect(project.title).toBe(projectData.title);
      expect(project.description).toBe(projectData.description);
      expect(project.dueDate).toEqual(projectData.dueDate);
      expect(project.priority).toBe(projectData.priority);
      expect(project.owner).toEqual(userId);
      expect(project.created_by).toEqual(userId);
    });

    it('should use default description when not provided', () => {
      const userId = new Types.ObjectId();
      const projectData = {
        title: 'Test Project',
        dueDate: new Date('2024-12-31'),
        owner: userId,
        created_by: userId,
      };

      const project = new Project(projectData);

      expect(project.description).toBe('N/A');
    });

    it('should use default priority when not provided', () => {
      const userId = new Types.ObjectId();
      const projectData = {
        title: 'Test Project',
        description: 'Test Description',
        dueDate: new Date('2024-12-31'),
        owner: userId,
        created_by: userId,
      };

      const project = new Project(projectData);

      expect(project.priority).toBe(ProjectPriority.MEDIUM);
    });

    it('should initialize tasks as empty array', () => {
      const userId = new Types.ObjectId();
      const projectData = {
        title: 'Test Project',
        description: 'Test Description',
        dueDate: new Date('2024-12-31'),
        owner: userId,
        created_by: userId,
      };

      const project = new Project(projectData);

      expect(project.tasks).toBeDefined();
      expect(Array.isArray(project.tasks)).toBe(true);
      expect(project.tasks.length).toBe(0);
    });
  });

  describe('Validation', () => {
    it('should fail validation when required fields are missing', () => {
      const project = new Project({});
      const validationError = project.validateSync();

      expect(validationError).toBeDefined();
      expect(validationError?.errors.title).toBeDefined();
      expect(validationError?.errors.dueDate).toBeDefined();
      expect(validationError?.errors.owner).toBeDefined();
      expect(validationError?.errors.created_by).toBeDefined();
    });

    it('should pass validation with all required fields', () => {
      const userId = new Types.ObjectId();
      const projectData = {
        title: 'Test Project',
        description: 'Test Description',
        dueDate: new Date('2024-12-31'),
        priority: ProjectPriority.HIGH,
        owner: userId,
        created_by: userId,
      };

      const project = new Project(projectData);
      const validationError = project.validateSync();

      expect(validationError).toBeUndefined();
    });

    it('should fail validation with invalid priority', () => {
      const userId = new Types.ObjectId();
      const projectData = {
        title: 'Test Project',
        description: 'Test Description',
        dueDate: new Date('2024-12-31'),
        priority: 'INVALID_PRIORITY' as any,
        owner: userId,
        created_by: userId,
      };

      const project = new Project(projectData);
      const validationError = project.validateSync();

      expect(validationError).toBeDefined();
      expect(validationError?.errors.priority).toBeDefined();
    });

    it('should validate date types', () => {
      const userId = new Types.ObjectId();
      const projectData = {
        title: 'Test Project',
        description: 'Test Description',
        dueDate: 'invalid-date' as any,
        owner: userId,
        created_by: userId,
      };

      const project = new Project(projectData);
      const validationError = project.validateSync();

      expect(validationError).toBeDefined();
    });
  });

  describe('JSON Transformation', () => {
    it('should transform _id to id in JSON output', () => {
      const userId = new Types.ObjectId();
      const projectData = {
        title: 'Test Project',
        description: 'Test Description',
        dueDate: new Date('2024-12-31'),
        owner: userId,
        created_by: userId,
      };

      const project = new Project(projectData);
      const json = project.toJSON();

      expect(json.id).toBeDefined();
      expect(json._id).toBeUndefined();
      expect(json.__v).toBeUndefined();
    });
  });
});
