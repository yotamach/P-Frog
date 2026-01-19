import { TaskService } from '../task.service';
import { Task, TaskStatus } from '../../schemas/task.schema';
import { Types } from 'mongoose';

jest.mock('../../schemas/task.schema');

describe('TaskService', () => {
  let taskService: TaskService;
  let mockUserId: string;
  let mockTaskId: string;

  beforeEach(() => {
    taskService = new TaskService();
    mockUserId = new Types.ObjectId().toString();
    mockTaskId = new Types.ObjectId().toString();
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    it('should call Task.find with correct parameters', () => {
      const mockCallback = jest.fn();
      const mockExec = jest.fn().mockReturnValue(Promise.resolve([]));
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });
      (Task.find as jest.Mock) = jest.fn().mockReturnValue({ populate: mockPopulate });

      taskService.getTasks(mockUserId, mockCallback);

      expect(Task.find).toHaveBeenCalledWith({ created_by: mockUserId });
      expect(mockPopulate).toHaveBeenCalledWith('project');
      expect(mockExec).toHaveBeenCalledWith(mockCallback);
    });
  });

  describe('getTaskByParams', () => {
    it('should call Task.find with provided params', () => {
      const mockParams = { status: TaskStatus.TODO };
      const mockCallback = jest.fn();
      (Task.find as jest.Mock) = jest.fn();

      taskService.getTaskByParams(mockParams, mockCallback);

      expect(Task.find).toHaveBeenCalledWith(mockParams, mockCallback);
    });
  });

  describe('createTask', () => {
    it('should create a task and populate project', async () => {
      const mockTaskData = {
        title: 'Test Task',
        description: 'Test Description',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        status: TaskStatus.TODO,
        created_by: mockUserId,
      };

      const mockCreatedTask = { ...mockTaskData, _id: mockTaskId };
      const mockExec = jest.fn().mockResolvedValue(mockCreatedTask);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });
      const mockFindById = jest.fn().mockReturnValue({ populate: mockPopulate });
      
      (Task.create as jest.Mock) = jest.fn().mockResolvedValue({ _id: mockTaskId });
      (Task.findById as jest.Mock) = mockFindById;

      const result = await taskService.createTask(mockTaskData);

      expect(Task.create).toHaveBeenCalledWith(mockTaskData);
      expect(Task.findById).toHaveBeenCalledWith(mockTaskId);
      expect(mockPopulate).toHaveBeenCalledWith('project');
      expect(result).toEqual(mockCreatedTask);
    });
  });

  describe('updateTask', () => {
    it('should call findOneAndUpdate with correct parameters', async () => {
      const mockTaskData = {
        title: 'Updated Task',
        description: 'Updated Description',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        status: TaskStatus.IN_PROGRESS,
        created_by: mockUserId,
      };

      const mockExec = jest.fn().mockResolvedValue(mockTaskData);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });
      (Task.findOneAndUpdate as jest.Mock) = jest.fn().mockReturnValue({ populate: mockPopulate });

      await taskService.updateTask(mockTaskData, mockTaskId, mockUserId);

      expect(Task.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockTaskId, created_by: mockUserId },
        { ...mockTaskData },
        { new: true }
      );
      expect(mockPopulate).toHaveBeenCalledWith('project');
    });

    it('should return updated task with project populated', async () => {
      const mockTaskData = {
        title: 'Updated Task',
        description: 'Updated Description',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        status: TaskStatus.DONE,
        created_by: mockUserId,
      };

      const mockUpdatedTask = { ...mockTaskData, _id: mockTaskId };
      const mockExec = jest.fn().mockResolvedValue(mockUpdatedTask);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });
      (Task.findOneAndUpdate as jest.Mock) = jest.fn().mockReturnValue({ populate: mockPopulate });

      const result = await taskService.updateTask(mockTaskData, mockTaskId, mockUserId);

      expect(result).toEqual(mockUpdatedTask);
    });
  });

  describe('deleteTask', () => {
    it('should call findOneAndDelete with correct parameters', () => {
      const mockCallback = jest.fn();
      (Task.findOneAndDelete as jest.Mock) = jest.fn();

      taskService.deleteTask(mockTaskId, mockUserId, mockCallback);

      expect(Task.findOneAndDelete).toHaveBeenCalledWith(
        { _id: mockTaskId, created_by: mockUserId },
        mockCallback
      );
    });
  });
});
