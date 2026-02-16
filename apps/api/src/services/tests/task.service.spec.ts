import { TaskService } from '../task.service';
import { Task, TaskStatus } from '../../schemas/task.schema';
import { ProjectMember } from '../../schemas/project-member.schema';
import { Types } from 'mongoose';
import * as PermissionService from '../permission.service';

jest.mock('../../schemas/task.schema');
jest.mock('../../schemas/project-member.schema');
jest.mock('../permission.service');

describe('TaskService', () => {
  let taskService: TaskService;
  let mockUserId: string;
  let mockTaskId: string;
  let mockProjectId: string;

  beforeEach(() => {
    taskService = new TaskService();
    mockUserId = new Types.ObjectId().toString();
    mockTaskId = new Types.ObjectId().toString();
    mockProjectId = new Types.ObjectId().toString();
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    it('should return all tasks for superuser', async () => {
      const mockTasks = [{ _id: mockTaskId, title: 'Test Task' }];
      
      (PermissionService.isSuperuser as jest.Mock).mockResolvedValue(true);
      
      const mockExec = jest.fn().mockResolvedValue(mockTasks);
      const mockPopulateAssignee = jest.fn().mockReturnValue({ exec: mockExec });
      const mockPopulateProject = jest.fn().mockReturnValue({ populate: mockPopulateAssignee });
      (Task.find as jest.Mock) = jest.fn().mockReturnValue({ populate: mockPopulateProject });

      const result = await taskService.getTasks(mockUserId);

      expect(PermissionService.isSuperuser).toHaveBeenCalledWith(mockUserId);
      expect(Task.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockTasks);
    });

    it('should return tasks for non-superuser based on membership', async () => {
      const mockTasks = [{ _id: mockTaskId, title: 'Test Task' }];
      const mockMemberships = [{ project: mockProjectId }];
      
      (PermissionService.isSuperuser as jest.Mock).mockResolvedValue(false);
      (ProjectMember.find as jest.Mock) = jest.fn().mockResolvedValue(mockMemberships);
      
      const mockExec = jest.fn().mockResolvedValue(mockTasks);
      const mockPopulateAssignee = jest.fn().mockReturnValue({ exec: mockExec });
      const mockPopulateProject = jest.fn().mockReturnValue({ populate: mockPopulateAssignee });
      (Task.find as jest.Mock) = jest.fn().mockReturnValue({ populate: mockPopulateProject });

      const result = await taskService.getTasks(mockUserId);

      expect(PermissionService.isSuperuser).toHaveBeenCalledWith(mockUserId);
      expect(ProjectMember.find).toHaveBeenCalledWith({ user: mockUserId });
      expect(Task.find).toHaveBeenCalledWith({
        $or: [
          { created_by: mockUserId },
          { assignee: mockUserId },
          { project: { $in: [mockProjectId] } }
        ]
      });
      expect(result).toEqual(mockTasks);
    });
  });

  describe('getTaskById', () => {
    it('should find task by ID with populated fields', async () => {
      const mockTask = { _id: mockTaskId, title: 'Test Task' };
      
      const mockExec = jest.fn().mockResolvedValue(mockTask);
      const mockPopulateAssignee = jest.fn().mockReturnValue({ exec: mockExec });
      const mockPopulateProject = jest.fn().mockReturnValue({ populate: mockPopulateAssignee });
      (Task.findById as jest.Mock) = jest.fn().mockReturnValue({ populate: mockPopulateProject });

      const result = await taskService.getTaskById(mockTaskId);

      expect(Task.findById).toHaveBeenCalledWith(mockTaskId);
      expect(result).toEqual(mockTask);
    });
  });

  describe('getTaskByParams', () => {
    it('should call Task.find with provided params', () => {
      const mockParams = { status: TaskStatus.TODO };
      const mockCallback = jest.fn();
      const mockExec = jest.fn().mockReturnValue(Promise.resolve([]));
      const mockPopulateAssignee = jest.fn().mockReturnValue({ exec: mockExec });
      const mockPopulateProject = jest.fn().mockReturnValue({ populate: mockPopulateAssignee });
      (Task.find as jest.Mock) = jest.fn().mockReturnValue({ populate: mockPopulateProject });

      taskService.getTaskByParams(mockParams, mockCallback);

      expect(Task.find).toHaveBeenCalledWith(mockParams);
    });
  });

  describe('createTask', () => {
    it('should create a task with creatorId and populate fields', async () => {
      const mockTaskData = {
        title: 'Test Task',
        description: 'Test Description',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        status: TaskStatus.TODO,
      };

      const mockCreatedTask = { ...mockTaskData, _id: mockTaskId, created_by: mockUserId };
      const mockExec = jest.fn().mockResolvedValue(mockCreatedTask);
      const mockPopulateAssignee = jest.fn().mockReturnValue({ exec: mockExec });
      const mockPopulateProject = jest.fn().mockReturnValue({ populate: mockPopulateAssignee });
      
      (Task.create as jest.Mock) = jest.fn().mockResolvedValue({ _id: mockTaskId });
      (Task.findById as jest.Mock) = jest.fn().mockReturnValue({ populate: mockPopulateProject });

      const result = await taskService.createTask(mockTaskData, mockUserId);

      expect(Task.create).toHaveBeenCalledWith({
        ...mockTaskData,
        created_by: mockUserId
      });
      expect(Task.findById).toHaveBeenCalledWith(mockTaskId);
      expect(result).toEqual(mockCreatedTask);
    });
  });

  describe('updateTask', () => {
    it('should call findByIdAndUpdate with correct parameters', async () => {
      const mockTaskData = {
        title: 'Updated Task',
        description: 'Updated Description',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        status: TaskStatus.IN_PROGRESS,
      };

      const mockUpdatedTask = { ...mockTaskData, _id: mockTaskId };
      const mockExec = jest.fn().mockResolvedValue(mockUpdatedTask);
      const mockPopulateAssignee = jest.fn().mockReturnValue({ exec: mockExec });
      const mockPopulateProject = jest.fn().mockReturnValue({ populate: mockPopulateAssignee });
      (Task.findByIdAndUpdate as jest.Mock) = jest.fn().mockReturnValue({ populate: mockPopulateProject });

      const result = await taskService.updateTask(mockTaskData, mockTaskId);

      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
        mockTaskId,
        { ...mockTaskData },
        { new: true }
      );
      expect(result).toEqual(mockUpdatedTask);
    });
  });

  describe('deleteTask', () => {
    it('should call findByIdAndDelete with task ID', async () => {
      const mockDeletedTask = { _id: mockTaskId, title: 'Deleted Task' };
      (Task.findByIdAndDelete as jest.Mock) = jest.fn().mockResolvedValue(mockDeletedTask);

      const result = await taskService.deleteTask(mockTaskId);

      expect(Task.findByIdAndDelete).toHaveBeenCalledWith(mockTaskId);
      expect(result).toEqual(mockDeletedTask);
    });
  });

  describe('assignTask', () => {
    it('should assign task to user', async () => {
      const mockAssigneeId = new Types.ObjectId().toString();
      const mockUpdatedTask = { _id: mockTaskId, assignee: mockAssigneeId };
      
      const mockExec = jest.fn().mockResolvedValue(mockUpdatedTask);
      const mockPopulateAssignee = jest.fn().mockReturnValue({ exec: mockExec });
      const mockPopulateProject = jest.fn().mockReturnValue({ populate: mockPopulateAssignee });
      (Task.findByIdAndUpdate as jest.Mock) = jest.fn().mockReturnValue({ populate: mockPopulateProject });

      const result = await taskService.assignTask(mockTaskId, mockAssigneeId);

      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
        mockTaskId,
        { assignee: mockAssigneeId },
        { new: true }
      );
      expect(result).toEqual(mockUpdatedTask);
    });

    it('should allow unassigning task (null assignee)', async () => {
      const mockUpdatedTask = { _id: mockTaskId, assignee: null };
      
      const mockExec = jest.fn().mockResolvedValue(mockUpdatedTask);
      const mockPopulateAssignee = jest.fn().mockReturnValue({ exec: mockExec });
      const mockPopulateProject = jest.fn().mockReturnValue({ populate: mockPopulateAssignee });
      (Task.findByIdAndUpdate as jest.Mock) = jest.fn().mockReturnValue({ populate: mockPopulateProject });

      const result = await taskService.assignTask(mockTaskId, null);

      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
        mockTaskId,
        { assignee: null },
        { new: true }
      );
      expect(result).toEqual(mockUpdatedTask);
    });
  });

  describe('getTasksByProject', () => {
    it('should find tasks by project ID', async () => {
      const mockTasks = [{ _id: mockTaskId, project: mockProjectId }];
      
      const mockExec = jest.fn().mockResolvedValue(mockTasks);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });
      (Task.find as jest.Mock) = jest.fn().mockReturnValue({ populate: mockPopulate });

      const result = await taskService.getTasksByProject(mockProjectId);

      expect(Task.find).toHaveBeenCalledWith({ project: mockProjectId });
      expect(result).toEqual(mockTasks);
    });
  });
});
