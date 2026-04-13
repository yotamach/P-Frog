import { Logger } from "tslog";
import { ProjectMember, IProjectMember, ProjectRole, User } from "@schemas";

const log = new Logger({});

export class ProjectMemberService {
  
  /**
   * Add a user as a member to a project
   */
  async addMember(projectId: string, userId: string, role: ProjectRole = ProjectRole.MEMBER): Promise<IProjectMember> {
    log.info(`ProjectMemberService.addMember: Adding user ${userId} to project ${projectId} with role ${role}`);
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Create membership
    const membership = await ProjectMember.create({
      project: projectId,
      user: userId,
      role
    });
    
    return membership;
  }

  /**
   * Remove a user from a project
   */
  async removeMember(projectId: string, userId: string): Promise<IProjectMember | null> {
    log.info(`ProjectMemberService.removeMember: Removing user ${userId} from project ${projectId}`);
    return ProjectMember.findOneAndDelete({ project: projectId, user: userId });
  }

  /**
   * Update a member's role in a project
   */
  async updateMemberRole(projectId: string, userId: string, newRole: ProjectRole): Promise<IProjectMember | null> {
    log.info(`ProjectMemberService.updateMemberRole: Updating user ${userId} role to ${newRole} in project ${projectId}`);
    return ProjectMember.findOneAndUpdate(
      { project: projectId, user: userId },
      { role: newRole },
      { new: true }
    ).populate('user', 'id userName firstName lastName email');
  }

  /**
   * Get all members of a project
   */
  async getProjectMembers(projectId: string): Promise<IProjectMember[]> {
    log.info(`ProjectMemberService.getProjectMembers: Getting members for project ${projectId}`);
    return ProjectMember.find({ project: projectId })
      .populate('user', 'id userName firstName lastName email')
      .exec();
  }

  /**
   * Get a specific membership
   */
  async getMembership(projectId: string, userId: string): Promise<IProjectMember | null> {
    log.info(`ProjectMemberService.getMembership: Getting membership for user ${userId} in project ${projectId}`);
    return ProjectMember.findOne({ project: projectId, user: userId })
      .populate('user', 'id userName firstName lastName email');
  }

  /**
   * Get all projects a user is a member of
   */
  async getUserProjects(userId: string): Promise<IProjectMember[]> {
    log.info(`ProjectMemberService.getUserProjects: Getting projects for user ${userId}`);
    return ProjectMember.find({ user: userId })
      .populate('project')
      .exec();
  }

  /**
   * Check if a user is a member of a project
   */
  async isMember(projectId: string, userId: string): Promise<boolean> {
    const membership = await ProjectMember.findOne({ project: projectId, user: userId });
    return !!membership;
  }

  /**
   * Check if a user is an admin of a project
   */
  async isAdmin(projectId: string, userId: string): Promise<boolean> {
    const membership = await ProjectMember.findOne({ 
      project: projectId, 
      user: userId, 
      role: ProjectRole.ADMIN 
    });
    return !!membership;
  }

  /**
   * Count admins in a project (to prevent removing the last admin)
   */
  async countAdmins(projectId: string): Promise<number> {
    return ProjectMember.countDocuments({ project: projectId, role: ProjectRole.ADMIN });
  }

  /**
   * Get all members by user IDs (for bulk operations)
   */
  async getMembersByUserIds(projectId: string, userIds: string[]): Promise<IProjectMember[]> {
    return ProjectMember.find({ 
      project: projectId, 
      user: { $in: userIds } 
    }).populate('user', 'id userName firstName lastName email');
  }
}
