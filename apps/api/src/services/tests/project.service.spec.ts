import { ProjectService } from '../project.service';
import { Project, ProjectPriority } from '../../schemas/project.schema';
import { Types } from 'mongoose';

jest.mock('../../schemas/project.schema');

describe('ProjectService', () => {
  let projectService: ProjectService;
  let mockUserId: string;
  let mockProjectId: string;

  beforeEach(() => {
    projectService = new ProjectService();
    mockUserId = new Types.ObjectId().toString();
    mockProjectId = new Types.ObjectId().toString();
    jest.clearAllMocks();
  });

  describe('getProjects', () => {
    it('should call Project.find with correct parameters', () => {
      const mockCallback = jest.fn();
      const mockExec = jest.fn().mockReturnValue(Promise.resolve([]));
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });
      (Project.find as jest.Mock) = jest.fn().mockReturnValue({ populate: mockPopulate });

      projectService.getProjects(mockUserId, mockCallback);

      expect(Project.find).toHaveBeenCalledWith({ created_by: mockUserId });
      expect(mockPopulate).toHaveBeenCalledWith('tasks');
      expect(mockExec).toHaveBeenCalledWith(mockCallback);
    });
  });

  describe('getProjectByParams', () => {
    it('should call Project.find with provided params', () => {
      const mockParams = { title: 'Test Project' };
      const mockCallback = jest.fn();
      const mockExec = jest.fn().mockReturnValue(Promise.resolve([]));
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });
      (Project.find as jest.Mock) = jest.fn().mockReturnValue({ populate: mockPopulate });

      projectService.getProjectByParams(mockParams, mockCallback);

      expect(Project.find).toHaveBeenCalledWith(mockParams);
      expect(mockPopulate).toHaveBeenCalledWith('tasks');
      expect(mockExec).toHaveBeenCalledWith(mockCallback);
    });
  });

  describe('createProject', () => {
    it('should create a project with owner set to created_by', async () => {
      const mockProjectData = {
        title: 'Test Project',
        description: 'Test Description',
        dueDate: new Date('2024-12-31'),
        priority: ProjectPriority.HIGH,
        created_by: mockUserId,
      };

      const mockCreatedProject = { ...mockProjectData, _id: mockProjectId };
      (Project.create as jest.Mock) = jest.fn().mockResolvedValue(mockCreatedProject);

      await projectService.createProject(mockProjectData);

      expect(Project.create).toHaveBeenCalledWith({
        ...mockProjectData,
        owner: mockProjectData.created_by,
      });
    });

    it('should return created project', async () => {
      const mockProjectData = {
        title: 'Test Project',
        description: 'Test Description',
        dueDate: new Date('2024-12-31'),
        priority: ProjectPriority.HIGH,
        created_by: mockUserId,
      };

      const mockCreatedProject = { ...mockProjectData, _id: mockProjectId };
      (Project.create as jest.Mock) = jest.fn().mockResolvedValue(mockCreatedProject);

      const result = await projectService.createProject(mockProjectData);

      expect(result).toEqual(mockCreatedProject);
    });
  });

  describe('updateProject', () => {
    it('should call findOneAndUpdate with correct parameters', async () => {
      const mockProjectData = {
        title: 'Updated Project',
        description: 'Updated Description',
        dueDate: new Date('2024-12-31'),
        priority: ProjectPriority.CRITICAL,
        created_by: mockUserId,
      };

      const mockExec = jest.fn().mockResolvedValue(mockProjectData);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });
      (Project.findOneAndUpdate as jest.Mock) = jest.fn().mockReturnValue({ populate: mockPopulate });

      await projectService.updateProject(mockProjectData, mockProjectId, mockUserId);

      expect(Project.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockProjectId, created_by: mockUserId },
        { ...mockProjectData },
        { new: true }
      );
      expect(mockPopulate).toHaveBeenCalledWith('tasks');
    });

    it('should return updated project', async () => {
      const mockProjectData = {
        title: 'Updated Project',
        description: 'Updated Description',
        dueDate: new Date('2024-12-31'),
        priority: ProjectPriority.CRITICAL,
        created_by: mockUserId,
      };

      const mockUpdatedProject = { ...mockProjectData, _id: mockProjectId };
      const mockExec = jest.fn().mockResolvedValue(mockUpdatedProject);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });
      (Project.findOneAndUpdate as jest.Mock) = jest.fn().mockReturnValue({ populate: mockPopulate });

      const result = await projectService.updateProject(mockProjectData, mockProjectId, mockUserId);

      expect(result).toEqual(mockUpdatedProject);
    });
  });

  describe('deleteProject', () => {
    it('should call findOneAndDelete with correct parameters', () => {
      const mockCallback = jest.fn();
      (Project.findOneAndDelete as jest.Mock) = jest.fn();

      projectService.deleteProject(mockProjectId, mockUserId, mockCallback);

      expect(Project.findOneAndDelete).toHaveBeenCalledWith(
        { _id: mockProjectId, created_by: mockUserId },
        mockCallback
      );
    });
  });

  describe('addTaskToProject', () => {
    it('should add task to project tasks array', async () => {
      const mockTaskId = new Types.ObjectId().toString();
      const mockUpdatedProject = {
        _id: mockProjectId,
        title: 'Test Project',
        tasks: [mockTaskId],
      };

      const mockExec = jest.fn().mockResolvedValue(mockUpdatedProject);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });
      (Project.findOneAndUpdate as jest.Mock) = jest.fn().mockReturnValue({ populate: mockPopulate });

      await projectService.addTaskToProject(mockProjectId, mockTaskId, mockUserId);

      expect(Project.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockProjectId, created_by: mockUserId },
        { $addToSet: { tasks: mockTaskId } },
        { new: true }
      );
      expect(mockPopulate).toHaveBeenCalledWith('tasks');
    });

    it('should return updated project with tasks populated', async () => {
      const mockTaskId = new Types.ObjectId().toString();
      const mockUpdatedProject = {
        _id: mockProjectId,
        title: 'Test Project',
        tasks: [{ _id: mockTaskId, title: 'Task 1' }],
      };

      const mockExec = jest.fn().mockResolvedValue(mockUpdatedProject);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });
      (Project.findOneAndUpdate as jest.Mock) = jest.fn().mockReturnValue({ populate: mockPopulate });

      const result = await projectService.addTaskToProject(mockProjectId, mockTaskId, mockUserId);

      expect(result).toEqual(mockUpdatedProject);
    });
  });
});
