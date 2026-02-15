import { ProjectService } from '../project.service';
import { Project, ProjectPriority } from '../../schemas/project.schema';
import { ProjectMember, ProjectRole } from '../../schemas/project-member.schema';
import { Types } from 'mongoose';
import * as PermissionService from '../permission.service';

// Mock schemas
jest.mock('../../schemas/project.schema');
jest.mock('../../schemas/project-member.schema');
jest.mock('../permission.service');

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
    it('should return all projects for superuser', async () => {
      const mockProjects = [{ _id: mockProjectId, title: 'Test Project' }];
      
      // Mock isSuperuser to return true
      (PermissionService.isSuperuser as jest.Mock).mockResolvedValue(true);
      
      const mockExec = jest.fn().mockResolvedValue(mockProjects);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });
      (Project.find as jest.Mock) = jest.fn().mockReturnValue({ populate: mockPopulate });

      const result = await projectService.getProjects(mockUserId);

      expect(PermissionService.isSuperuser).toHaveBeenCalledWith(mockUserId);
      expect(Project.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockProjects);
    });

    it('should return only member projects for non-superuser', async () => {
      const mockProjects = [{ _id: mockProjectId, title: 'Test Project' }];
      const mockMemberships = [{ project: mockProjectId }];
      
      // Mock isSuperuser to return false
      (PermissionService.isSuperuser as jest.Mock).mockResolvedValue(false);
      (ProjectMember.find as jest.Mock) = jest.fn().mockResolvedValue(mockMemberships);
      
      const mockExec = jest.fn().mockResolvedValue(mockProjects);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });
      (Project.find as jest.Mock) = jest.fn().mockReturnValue({ populate: mockPopulate });

      const result = await projectService.getProjects(mockUserId);

      expect(PermissionService.isSuperuser).toHaveBeenCalledWith(mockUserId);
      expect(ProjectMember.find).toHaveBeenCalledWith({ user: mockUserId });
      expect(Project.find).toHaveBeenCalledWith({ _id: { $in: [mockProjectId] } });
      expect(result).toEqual(mockProjects);
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

  describe('getProjectById', () => {
    it('should find project by ID', async () => {
      const mockProject = { _id: mockProjectId, title: 'Test Project' };
      const mockExec = jest.fn().mockResolvedValue(mockProject);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });
      (Project.findById as jest.Mock) = jest.fn().mockReturnValue({ populate: mockPopulate });

      const result = await projectService.getProjectById(mockProjectId);

      expect(Project.findById).toHaveBeenCalledWith(mockProjectId);
      expect(result).toEqual(mockProject);
    });
  });

  describe('createProject', () => {
    it('should create a project and add creator as admin member', async () => {
      const mockProjectData = {
        title: 'Test Project',
        description: 'Test Description',
        dueDate: new Date('2024-12-31'),
        priority: ProjectPriority.HIGH,
      };

      const mockCreatedProject = { ...mockProjectData, _id: mockProjectId, created_by: mockUserId };
      (Project.create as jest.Mock) = jest.fn().mockResolvedValue(mockCreatedProject);
      (ProjectMember.create as jest.Mock) = jest.fn().mockResolvedValue({});

      const result = await projectService.createProject(mockProjectData, mockUserId);

      expect(Project.create).toHaveBeenCalledWith({
        ...mockProjectData,
        created_by: mockUserId,
      });
      expect(ProjectMember.create).toHaveBeenCalledWith({
        project: mockProjectId,
        user: mockUserId,
        role: ProjectRole.ADMIN,
      });
      expect(result).toEqual(mockCreatedProject);
    });
  });

  describe('updateProject', () => {
    it('should call findByIdAndUpdate with correct parameters', async () => {
      const mockProjectData = {
        title: 'Updated Project',
        description: 'Updated Description',
        dueDate: new Date('2024-12-31'),
        priority: ProjectPriority.CRITICAL,
      };

      const mockUpdatedProject = { ...mockProjectData, _id: mockProjectId };
      const mockExec = jest.fn().mockResolvedValue(mockUpdatedProject);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });
      (Project.findByIdAndUpdate as jest.Mock) = jest.fn().mockReturnValue({ populate: mockPopulate });

      const result = await projectService.updateProject(mockProjectData, mockProjectId);

      expect(Project.findByIdAndUpdate).toHaveBeenCalledWith(
        mockProjectId,
        { ...mockProjectData },
        { new: true }
      );
      expect(result).toEqual(mockUpdatedProject);
    });
  });

  describe('deleteProject', () => {
    it('should delete project and all memberships', async () => {
      const mockDeletedProject = { _id: mockProjectId, title: 'Deleted Project' };
      (ProjectMember.deleteMany as jest.Mock) = jest.fn().mockResolvedValue({ deletedCount: 2 });
      (Project.findByIdAndDelete as jest.Mock) = jest.fn().mockResolvedValue(mockDeletedProject);

      const result = await projectService.deleteProject(mockProjectId);

      expect(ProjectMember.deleteMany).toHaveBeenCalledWith({ project: mockProjectId });
      expect(Project.findByIdAndDelete).toHaveBeenCalledWith(mockProjectId);
      expect(result).toEqual(mockDeletedProject);
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
      (Project.findByIdAndUpdate as jest.Mock) = jest.fn().mockReturnValue({ populate: mockPopulate });

      const result = await projectService.addTaskToProject(mockProjectId, mockTaskId);

      expect(Project.findByIdAndUpdate).toHaveBeenCalledWith(
        mockProjectId,
        { $addToSet: { tasks: mockTaskId } },
        { new: true }
      );
      expect(result).toEqual(mockUpdatedProject);
    });
  });

  describe('removeTaskFromProject', () => {
    it('should remove task from project tasks array', async () => {
      const mockTaskId = new Types.ObjectId().toString();
      const mockUpdatedProject = {
        _id: mockProjectId,
        title: 'Test Project',
        tasks: [],
      };

      const mockExec = jest.fn().mockResolvedValue(mockUpdatedProject);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });
      (Project.findByIdAndUpdate as jest.Mock) = jest.fn().mockReturnValue({ populate: mockPopulate });

      const result = await projectService.removeTaskFromProject(mockProjectId, mockTaskId);

      expect(Project.findByIdAndUpdate).toHaveBeenCalledWith(
        mockProjectId,
        { $pull: { tasks: mockTaskId } },
        { new: true }
      );
      expect(result).toEqual(mockUpdatedProject);
    });
  });
});