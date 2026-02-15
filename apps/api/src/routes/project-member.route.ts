import { Response, Router } from "express";
import { Logger } from "tslog";
import { AppRouter } from "@models";
import { ProjectMemberService } from "src/services/project-member.service";
import { ProjectRole } from "@schemas";
import { auth } from "../middleware/authentication";
import { requireProjectAdmin, requireProjectMember, getUserId } from "../middleware/authorization";
import { isSuperuser } from "@controllers";

const log: Logger = new Logger();
const projectMemberRouter: Router = Router({ mergeParams: true }); // mergeParams to access :projectId from parent
const projectMemberService: ProjectMemberService = new ProjectMemberService();

/**
 * GET /projects/:projectId/members
 * List all members of a project
 * Requires: project member or superuser
 */
projectMemberRouter.get('/', auth, requireProjectMember(), async (req: any, res: Response) => {
  const { projectId } = req.params;
  log.info(`GET /projects/${projectId}/members - Listing members`);
  
  try {
    const members = await projectMemberService.getProjectMembers(projectId);
    res.send({ success: true, members });
  } catch (e) {
    log.error(`GET /projects/${projectId}/members - Error: ${e}`);
    res.status(500).send({ success: false, error: e.message });
  }
});

/**
 * POST /projects/:projectId/members
 * Add a member to a project
 * Requires: project admin or superuser
 * Body: { userId: string, role?: 'admin' | 'member' }
 */
projectMemberRouter.post('/', auth, requireProjectAdmin(), async (req: any, res: Response) => {
  const { projectId } = req.params;
  const { userId, role = ProjectRole.MEMBER } = req.body;
  
  log.info(`POST /projects/${projectId}/members - Adding user ${userId} with role ${role}`);
  
  if (!userId) {
    return res.status(400).send({ success: false, error: 'userId is required' });
  }
  
  if (!Object.values(ProjectRole).includes(role)) {
    return res.status(400).send({ success: false, error: 'Invalid role. Must be "admin" or "member"' });
  }
  
  try {
    // Check if user is already a member
    const existingMembership = await projectMemberService.getMembership(projectId, userId);
    if (existingMembership) {
      return res.status(409).send({ success: false, error: 'User is already a member of this project' });
    }
    
    await projectMemberService.addMember(projectId, userId, role);
    const populatedMembership = await projectMemberService.getMembership(projectId, userId);
    
    log.info(`POST /projects/${projectId}/members - User ${userId} added successfully`);
    res.status(201).send({ success: true, member: populatedMembership });
  } catch (e) {
    log.error(`POST /projects/${projectId}/members - Error: ${e}`);
    if (e.message === 'User not found') {
      return res.status(404).send({ success: false, error: 'User not found' });
    }
    if (e.code === 11000) { // MongoDB duplicate key error
      return res.status(409).send({ success: false, error: 'User is already a member of this project' });
    }
    res.status(500).send({ success: false, error: e.message });
  }
});

/**
 * PATCH /projects/:projectId/members/:userId
 * Update a member's role
 * Requires: project admin or superuser
 * Body: { role: 'admin' | 'member' }
 */
projectMemberRouter.patch('/:userId', auth, requireProjectAdmin(), async (req: any, res: Response) => {
  const { projectId, userId } = req.params;
  const { role } = req.body;
  
  log.info(`PATCH /projects/${projectId}/members/${userId} - Updating role to ${role}`);
  
  if (!role || !Object.values(ProjectRole).includes(role)) {
    return res.status(400).send({ success: false, error: 'Invalid role. Must be "admin" or "member"' });
  }
  
  try {
    // Prevent demoting the last admin
    if (role === ProjectRole.MEMBER) {
      const currentMembership = await projectMemberService.getMembership(projectId, userId);
      if (currentMembership?.role === ProjectRole.ADMIN) {
        const adminCount = await projectMemberService.countAdmins(projectId);
        if (adminCount <= 1) {
          return res.status(400).send({ 
            success: false, 
            error: 'Cannot demote the last admin. Promote another member first.' 
          });
        }
      }
    }
    
    const updatedMembership = await projectMemberService.updateMemberRole(projectId, userId, role);
    
    if (!updatedMembership) {
      return res.status(404).send({ success: false, error: 'Membership not found' });
    }
    
    log.info(`PATCH /projects/${projectId}/members/${userId} - Role updated successfully`);
    res.send({ success: true, member: updatedMembership });
  } catch (e) {
    log.error(`PATCH /projects/${projectId}/members/${userId} - Error: ${e}`);
    res.status(500).send({ success: false, error: e.message });
  }
});

/**
 * DELETE /projects/:projectId/members/:userId
 * Remove a member from a project
 * Requires: project admin, superuser, OR the user themselves (leaving)
 */
projectMemberRouter.delete('/:userId', auth, async (req: any, res: Response) => {
  const { projectId, userId } = req.params;
  const requesterId = getUserId(req);
  
  log.info(`DELETE /projects/${projectId}/members/${userId} - Removing member (requester: ${requesterId})`);
  
  try {
    // Check if requester has permission
    const isSuperuserUser = await isSuperuser(requesterId);
    const isProjectAdminUser = await projectMemberService.isAdmin(projectId, requesterId);
    const isSelfLeaving = requesterId === userId;
    
    if (!isSuperuserUser && !isProjectAdminUser && !isSelfLeaving) {
      return res.status(403).send({ 
        success: false, 
        error: 'Forbidden: Only project admins can remove other members' 
      });
    }
    
    // Prevent removing the last admin
    const membershipToRemove = await projectMemberService.getMembership(projectId, userId);
    if (!membershipToRemove) {
      return res.status(404).send({ success: false, error: 'Membership not found' });
    }
    
    if (membershipToRemove.role === ProjectRole.ADMIN) {
      const adminCount = await projectMemberService.countAdmins(projectId);
      if (adminCount <= 1) {
        return res.status(400).send({ 
          success: false, 
          error: 'Cannot remove the last admin. Transfer admin role to another member first.' 
        });
      }
    }
    
    const removedMembership = await projectMemberService.removeMember(projectId, userId);
    
    if (!removedMembership) {
      return res.status(404).send({ success: false, error: 'Membership not found' });
    }
    
    log.info(`DELETE /projects/${projectId}/members/${userId} - Member removed successfully`);
    res.send({ success: true, message: 'Member removed from project' });
  } catch (e) {
    log.error(`DELETE /projects/${projectId}/members/${userId} - Error: ${e}`);
    res.status(500).send({ success: false, error: e.message });
  }
});

/**
 * GET /projects/:projectId/members/me
 * Get current user's membership in a project
 */
projectMemberRouter.get('/me', auth, async (req: any, res: Response) => {
  const { projectId } = req.params;
  const userId = getUserId(req);
  
  log.info(`GET /projects/${projectId}/members/me - Getting own membership`);
  
  try {
    const membership = await projectMemberService.getMembership(projectId, userId);
    
    if (!membership) {
      // Check if superuser (they have access even without membership)
      const isSuperuserUser = await isSuperuser(userId);
      if (isSuperuserUser) {
        return res.send({ 
          success: true, 
          member: null, 
          isSuperuser: true,
          effectiveRole: ProjectRole.ADMIN 
        });
      }
      return res.status(404).send({ success: false, error: 'Not a member of this project' });
    }
    
    res.send({ success: true, member: membership });
  } catch (e) {
    log.error(`GET /projects/${projectId}/members/me - Error: ${e}`);
    res.status(500).send({ success: false, error: e.message });
  }
});

const projectMemberRoutes: AppRouter = { url: '/projects/:projectId/members', router: projectMemberRouter };

export default projectMemberRoutes;
