import { Types } from 'mongoose';
import * as PermissionService from '../permission.service';
import { User, ProjectMember, ProjectRole, SystemRole } from '../../schemas';

jest.mock('../../schemas/user.schema');
jest.mock('../../schemas/project-member.schema');

describe('PermissionService', () => {
  let mockUserId: string;
  let mockProjectId: string;

  beforeEach(() => {
    mockUserId = new Types.ObjectId().toString();
    mockProjectId = new Types.ObjectId().toString();
    jest.clearAllMocks();
  });

  describe('isSuperuser', () => {
    it('should return true for superuser', async () => {
      (User.findById as jest.Mock) = jest.fn().mockResolvedValue({ role: SystemRole.SUPERUSER });

      const result = await PermissionService.isSuperuser(mockUserId);

      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(result).toBe(true);
    });

    it('should return false for non-superuser', async () => {
      (User.findById as jest.Mock) = jest.fn().mockResolvedValue({ role: SystemRole.MEMBER });

      const result = await PermissionService.isSuperuser(mockUserId);

      expect(result).toBe(false);
    });

    it('should return false if user not found', async () => {
      (User.findById as jest.Mock) = jest.fn().mockResolvedValue(null);

      const result = await PermissionService.isSuperuser(mockUserId);

      expect(result).toBe(false);
    });

    it('should return false on error', async () => {
      (User.findById as jest.Mock) = jest.fn().mockRejectedValue(new Error('DB error'));

      const result = await PermissionService.isSuperuser(mockUserId);

      expect(result).toBe(false);
    });
  });

  describe('getUserProjectRole', () => {
    it('should return role when user is a member', async () => {
      (ProjectMember.findOne as jest.Mock) = jest.fn().mockResolvedValue({ role: ProjectRole.ADMIN });

      const result = await PermissionService.getUserProjectRole(mockUserId, mockProjectId);

      expect(ProjectMember.findOne).toHaveBeenCalledWith({ user: mockUserId, project: mockProjectId });
      expect(result).toBe(ProjectRole.ADMIN);
    });

    it('should return null when user is not a member', async () => {
      (ProjectMember.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      const result = await PermissionService.getUserProjectRole(mockUserId, mockProjectId);

      expect(result).toBe(null);
    });

    it('should return null on error', async () => {
      (ProjectMember.findOne as jest.Mock) = jest.fn().mockRejectedValue(new Error('DB error'));

      const result = await PermissionService.getUserProjectRole(mockUserId, mockProjectId);

      expect(result).toBe(null);
    });
  });

  describe('isProjectMember', () => {
    it('should return true when user is a member', async () => {
      (ProjectMember.findOne as jest.Mock) = jest.fn().mockResolvedValue({ user: mockUserId, project: mockProjectId });

      const result = await PermissionService.isProjectMember(mockUserId, mockProjectId);

      expect(result).toBe(true);
    });

    it('should return false when user is not a member', async () => {
      (ProjectMember.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      const result = await PermissionService.isProjectMember(mockUserId, mockProjectId);

      expect(result).toBe(false);
    });
  });

  describe('isProjectAdmin', () => {
    it('should return true when user is an admin', async () => {
      (ProjectMember.findOne as jest.Mock) = jest.fn().mockResolvedValue({ 
        user: mockUserId, 
        project: mockProjectId, 
        role: ProjectRole.ADMIN 
      });

      const result = await PermissionService.isProjectAdmin(mockUserId, mockProjectId);

      expect(ProjectMember.findOne).toHaveBeenCalledWith({
        user: mockUserId,
        project: mockProjectId,
        role: ProjectRole.ADMIN
      });
      expect(result).toBe(true);
    });

    it('should return false when user is a member but not admin', async () => {
      (ProjectMember.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      const result = await PermissionService.isProjectAdmin(mockUserId, mockProjectId);

      expect(result).toBe(false);
    });
  });

  describe('canAccessProject', () => {
    it('should return true for superuser', async () => {
      (User.findById as jest.Mock) = jest.fn().mockResolvedValue({ role: SystemRole.SUPERUSER });

      const result = await PermissionService.canAccessProject(mockUserId, mockProjectId);

      expect(result).toBe(true);
    });

    it('should return true for project member', async () => {
      (User.findById as jest.Mock) = jest.fn().mockResolvedValue({ role: SystemRole.MEMBER });
      (ProjectMember.findOne as jest.Mock) = jest.fn().mockResolvedValue({ user: mockUserId });

      const result = await PermissionService.canAccessProject(mockUserId, mockProjectId);

      expect(result).toBe(true);
    });

    it('should return false for non-member non-superuser', async () => {
      (User.findById as jest.Mock) = jest.fn().mockResolvedValue({ role: SystemRole.MEMBER });
      (ProjectMember.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      const result = await PermissionService.canAccessProject(mockUserId, mockProjectId);

      expect(result).toBe(false);
    });
  });

  describe('canManageProject', () => {
    it('should return true for superuser', async () => {
      (User.findById as jest.Mock) = jest.fn().mockResolvedValue({ role: SystemRole.SUPERUSER });

      const result = await PermissionService.canManageProject(mockUserId, mockProjectId);

      expect(result).toBe(true);
    });

    it('should return true for project admin', async () => {
      (User.findById as jest.Mock) = jest.fn().mockResolvedValue({ role: SystemRole.MEMBER });
      (ProjectMember.findOne as jest.Mock) = jest.fn().mockResolvedValue({ role: ProjectRole.ADMIN });

      const result = await PermissionService.canManageProject(mockUserId, mockProjectId);

      expect(result).toBe(true);
    });

    it('should return false for regular member', async () => {
      (User.findById as jest.Mock) = jest.fn().mockResolvedValue({ role: SystemRole.MEMBER });
      (ProjectMember.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      const result = await PermissionService.canManageProject(mockUserId, mockProjectId);

      expect(result).toBe(false);
    });
  });

  describe('canModifyTask', () => {
    const mockTaskCreatorId = new Types.ObjectId().toString();
    const mockAssigneeId = new Types.ObjectId().toString();

    it('should return true for superuser', async () => {
      (User.findById as jest.Mock) = jest.fn().mockResolvedValue({ role: SystemRole.SUPERUSER });

      const result = await PermissionService.canModifyTask(mockUserId, mockTaskCreatorId, mockAssigneeId, mockProjectId);

      expect(result).toBe(true);
    });

    it('should return true for task creator', async () => {
      (User.findById as jest.Mock) = jest.fn().mockResolvedValue({ role: SystemRole.MEMBER });

      const result = await PermissionService.canModifyTask(mockUserId, mockUserId, mockAssigneeId, mockProjectId);

      expect(result).toBe(true);
    });

    it('should return true for task assignee', async () => {
      (User.findById as jest.Mock) = jest.fn().mockResolvedValue({ role: SystemRole.MEMBER });

      const result = await PermissionService.canModifyTask(mockUserId, mockTaskCreatorId, mockUserId, mockProjectId);

      expect(result).toBe(true);
    });

    it('should return true for project admin', async () => {
      (User.findById as jest.Mock) = jest.fn().mockResolvedValue({ role: SystemRole.MEMBER });
      (ProjectMember.findOne as jest.Mock) = jest.fn().mockResolvedValue({ role: ProjectRole.ADMIN });

      const result = await PermissionService.canModifyTask(mockUserId, mockTaskCreatorId, mockAssigneeId, mockProjectId);

      expect(result).toBe(true);
    });

    it('should return false for non-authorized user', async () => {
      (User.findById as jest.Mock) = jest.fn().mockResolvedValue({ role: SystemRole.MEMBER });
      (ProjectMember.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      const result = await PermissionService.canModifyTask(mockUserId, mockTaskCreatorId, mockAssigneeId, mockProjectId);

      expect(result).toBe(false);
    });
  });

  describe('canCreateTaskInProject', () => {
    it('should return true for standalone task (no project)', async () => {
      const result = await PermissionService.canCreateTaskInProject(mockUserId, null);

      expect(result).toBe(true);
    });

    it('should return true for superuser', async () => {
      (User.findById as jest.Mock) = jest.fn().mockResolvedValue({ role: SystemRole.SUPERUSER });

      const result = await PermissionService.canCreateTaskInProject(mockUserId, mockProjectId);

      expect(result).toBe(true);
    });

    it('should return true for project member', async () => {
      (User.findById as jest.Mock) = jest.fn().mockResolvedValue({ role: SystemRole.MEMBER });
      (ProjectMember.findOne as jest.Mock) = jest.fn().mockResolvedValue({ user: mockUserId });

      const result = await PermissionService.canCreateTaskInProject(mockUserId, mockProjectId);

      expect(result).toBe(true);
    });

    it('should return false for non-member', async () => {
      (User.findById as jest.Mock) = jest.fn().mockResolvedValue({ role: SystemRole.MEMBER });
      (ProjectMember.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      const result = await PermissionService.canCreateTaskInProject(mockUserId, mockProjectId);

      expect(result).toBe(false);
    });
  });

  describe('canAssignTask', () => {
    it('should return false for standalone task (no project)', async () => {
      const result = await PermissionService.canAssignTask(mockUserId, null);

      expect(result).toBe(false);
    });

    it('should return true for superuser', async () => {
      (User.findById as jest.Mock) = jest.fn().mockResolvedValue({ role: SystemRole.SUPERUSER });

      const result = await PermissionService.canAssignTask(mockUserId, mockProjectId);

      expect(result).toBe(true);
    });

    it('should return true for project admin', async () => {
      (User.findById as jest.Mock) = jest.fn().mockResolvedValue({ role: SystemRole.MEMBER });
      (ProjectMember.findOne as jest.Mock) = jest.fn().mockResolvedValue({ role: ProjectRole.ADMIN });

      const result = await PermissionService.canAssignTask(mockUserId, mockProjectId);

      expect(result).toBe(true);
    });

    it('should return false for regular member', async () => {
      (User.findById as jest.Mock) = jest.fn().mockResolvedValue({ role: SystemRole.MEMBER });
      (ProjectMember.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      const result = await PermissionService.canAssignTask(mockUserId, mockProjectId);

      expect(result).toBe(false);
    });
  });
});
