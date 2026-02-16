import { Types } from 'mongoose';
import { ProjectMemberService } from '../project-member.service';
import { ProjectMember, ProjectRole, User } from '../../schemas';

jest.mock('../../schemas/user.schema');
jest.mock('../../schemas/project-member.schema');

describe('ProjectMemberService', () => {
  let service: ProjectMemberService;
  let mockUserId: string;
  let mockProjectId: string;

  beforeEach(() => {
    service = new ProjectMemberService();
    mockUserId = new Types.ObjectId().toString();
    mockProjectId = new Types.ObjectId().toString();
    jest.clearAllMocks();
  });

  describe('addMember', () => {
    it('should add a user as member to a project', async () => {
      const mockMembership = {
        project: mockProjectId,
        user: mockUserId,
        role: ProjectRole.MEMBER
      };

      (User.findById as jest.Mock) = jest.fn().mockResolvedValue({ _id: mockUserId });
      (ProjectMember.create as jest.Mock) = jest.fn().mockResolvedValue(mockMembership);

      const result = await service.addMember(mockProjectId, mockUserId);

      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(ProjectMember.create).toHaveBeenCalledWith({
        project: mockProjectId,
        user: mockUserId,
        role: ProjectRole.MEMBER
      });
      expect(result).toEqual(mockMembership);
    });

    it('should add a user as admin when role specified', async () => {
      const mockMembership = {
        project: mockProjectId,
        user: mockUserId,
        role: ProjectRole.ADMIN
      };

      (User.findById as jest.Mock) = jest.fn().mockResolvedValue({ _id: mockUserId });
      (ProjectMember.create as jest.Mock) = jest.fn().mockResolvedValue(mockMembership);

      const result = await service.addMember(mockProjectId, mockUserId, ProjectRole.ADMIN);

      expect(ProjectMember.create).toHaveBeenCalledWith({
        project: mockProjectId,
        user: mockUserId,
        role: ProjectRole.ADMIN
      });
      expect(result).toEqual(mockMembership);
    });

    it('should throw error if user not found', async () => {
      (User.findById as jest.Mock) = jest.fn().mockResolvedValue(null);

      await expect(service.addMember(mockProjectId, mockUserId))
        .rejects.toThrow('User not found');
    });
  });

  describe('removeMember', () => {
    it('should remove a member from project', async () => {
      const mockMembership = {
        project: mockProjectId,
        user: mockUserId,
        role: ProjectRole.MEMBER
      };

      (ProjectMember.findOneAndDelete as jest.Mock) = jest.fn().mockResolvedValue(mockMembership);

      const result = await service.removeMember(mockProjectId, mockUserId);

      expect(ProjectMember.findOneAndDelete).toHaveBeenCalledWith({
        project: mockProjectId,
        user: mockUserId
      });
      expect(result).toEqual(mockMembership);
    });

    it('should return null if membership not found', async () => {
      (ProjectMember.findOneAndDelete as jest.Mock) = jest.fn().mockResolvedValue(null);

      const result = await service.removeMember(mockProjectId, mockUserId);

      expect(result).toBeNull();
    });
  });

  describe('updateMemberRole', () => {
    it('should update member role', async () => {
      const mockMembership = {
        project: mockProjectId,
        user: mockUserId,
        role: ProjectRole.ADMIN
      };

      const mockPopulate = jest.fn().mockResolvedValue(mockMembership);
      (ProjectMember.findOneAndUpdate as jest.Mock) = jest.fn().mockReturnValue({
        populate: mockPopulate
      });

      const result = await service.updateMemberRole(mockProjectId, mockUserId, ProjectRole.ADMIN);

      expect(ProjectMember.findOneAndUpdate).toHaveBeenCalledWith(
        { project: mockProjectId, user: mockUserId },
        { role: ProjectRole.ADMIN },
        { new: true }
      );
      expect(result).toEqual(mockMembership);
    });
  });

  describe('getProjectMembers', () => {
    it('should return all members of a project', async () => {
      const mockMembers = [
        { project: mockProjectId, user: mockUserId, role: ProjectRole.ADMIN },
        { project: mockProjectId, user: new Types.ObjectId().toString(), role: ProjectRole.MEMBER }
      ];

      const mockExec = jest.fn().mockResolvedValue(mockMembers);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });
      (ProjectMember.find as jest.Mock) = jest.fn().mockReturnValue({
        populate: mockPopulate
      });

      const result = await service.getProjectMembers(mockProjectId);

      expect(ProjectMember.find).toHaveBeenCalledWith({ project: mockProjectId });
      expect(result).toEqual(mockMembers);
    });
  });

  describe('getMembership', () => {
    it('should return specific membership', async () => {
      const mockMembership = {
        project: mockProjectId,
        user: mockUserId,
        role: ProjectRole.MEMBER
      };

      const mockPopulate = jest.fn().mockResolvedValue(mockMembership);
      (ProjectMember.findOne as jest.Mock) = jest.fn().mockReturnValue({
        populate: mockPopulate
      });

      const result = await service.getMembership(mockProjectId, mockUserId);

      expect(ProjectMember.findOne).toHaveBeenCalledWith({
        project: mockProjectId,
        user: mockUserId
      });
      expect(result).toEqual(mockMembership);
    });

    it('should return null if membership not found', async () => {
      const mockPopulate = jest.fn().mockResolvedValue(null);
      (ProjectMember.findOne as jest.Mock) = jest.fn().mockReturnValue({
        populate: mockPopulate
      });

      const result = await service.getMembership(mockProjectId, mockUserId);

      expect(result).toBeNull();
    });
  });

  describe('getUserProjects', () => {
    it('should return all projects for a user', async () => {
      const mockMemberships = [
        { project: mockProjectId, user: mockUserId, role: ProjectRole.ADMIN },
        { project: new Types.ObjectId().toString(), user: mockUserId, role: ProjectRole.MEMBER }
      ];

      const mockExec = jest.fn().mockResolvedValue(mockMemberships);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });
      (ProjectMember.find as jest.Mock) = jest.fn().mockReturnValue({
        populate: mockPopulate
      });

      const result = await service.getUserProjects(mockUserId);

      expect(ProjectMember.find).toHaveBeenCalledWith({ user: mockUserId });
      expect(result).toEqual(mockMemberships);
    });
  });

  describe('isMember', () => {
    it('should return true when user is a member', async () => {
      (ProjectMember.findOne as jest.Mock) = jest.fn().mockResolvedValue({
        project: mockProjectId,
        user: mockUserId
      });

      const result = await service.isMember(mockProjectId, mockUserId);

      expect(result).toBe(true);
    });

    it('should return false when user is not a member', async () => {
      (ProjectMember.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      const result = await service.isMember(mockProjectId, mockUserId);

      expect(result).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should return true when user is an admin', async () => {
      (ProjectMember.findOne as jest.Mock) = jest.fn().mockResolvedValue({
        project: mockProjectId,
        user: mockUserId,
        role: ProjectRole.ADMIN
      });

      const result = await service.isAdmin(mockProjectId, mockUserId);

      expect(ProjectMember.findOne).toHaveBeenCalledWith({
        project: mockProjectId,
        user: mockUserId,
        role: ProjectRole.ADMIN
      });
      expect(result).toBe(true);
    });

    it('should return false when user is not an admin', async () => {
      (ProjectMember.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      const result = await service.isAdmin(mockProjectId, mockUserId);

      expect(result).toBe(false);
    });
  });

  describe('countAdmins', () => {
    it('should return count of admins in project', async () => {
      (ProjectMember.countDocuments as jest.Mock) = jest.fn().mockResolvedValue(2);

      const result = await service.countAdmins(mockProjectId);

      expect(ProjectMember.countDocuments).toHaveBeenCalledWith({
        project: mockProjectId,
        role: ProjectRole.ADMIN
      });
      expect(result).toBe(2);
    });
  });

  describe('getMembersByUserIds', () => {
    it('should return members matching user IDs', async () => {
      const userIds = [mockUserId, new Types.ObjectId().toString()];
      const mockMembers = [
        { project: mockProjectId, user: userIds[0], role: ProjectRole.ADMIN },
        { project: mockProjectId, user: userIds[1], role: ProjectRole.MEMBER }
      ];

      const mockPopulate = jest.fn().mockResolvedValue(mockMembers);
      (ProjectMember.find as jest.Mock) = jest.fn().mockReturnValue({
        populate: mockPopulate
      });

      const result = await service.getMembersByUserIds(mockProjectId, userIds);

      expect(ProjectMember.find).toHaveBeenCalledWith({
        project: mockProjectId,
        user: { $in: userIds }
      });
      expect(result).toEqual(mockMembers);
    });
  });
});
