import { Logger } from "tslog";
import { User, ProjectMember, ProjectRole, SystemRole } from '@schemas';

const log = new Logger({});

/**
 * Check if a user is a superuser
 */
export const isSuperuser = async (userId: string): Promise<boolean> => {
  try {
    const user = await User.findById(userId);
    return user?.role === SystemRole.SUPERUSER;
  } catch (err) {
    log.error(`Error checking superuser status: ${err.message}`);
    return false;
  }
};

/**
 * Check if a user is an admin or superuser
 */
export const isAdmin = async (userId: string): Promise<boolean> => {
  try {
    const user = await User.findById(userId);
    return user?.role === SystemRole.ADMIN || user?.role === SystemRole.SUPERUSER;
  } catch (err) {
    log.error(`Error checking admin status: ${err.message}`);
    return false;
  }
};

/**
 * Check if a user is project_manager, admin, or superuser
 */
export const isProjectManagerOrAbove = async (userId: string): Promise<boolean> => {
  try {
    const user = await User.findById(userId);
    return user?.role !== SystemRole.MEMBER && user?.role != null;
  } catch (err) {
    log.error(`Error checking project manager status: ${err.message}`);
    return false;
  }
};

/**
 * Get a user's role in a project
 * @returns ProjectRole or null if not a member
 */
export const getUserProjectRole = async (userId: string, projectId: string): Promise<ProjectRole | null> => {
  try {
    const membership = await ProjectMember.findOne({ user: userId, project: projectId });
    return membership?.role || null;
  } catch (err) {
    log.error(`Error getting user project role: ${err.message}`);
    return null;
  }
};

/**
 * Check if a user is a member of a project
 */
export const isProjectMember = async (userId: string, projectId: string): Promise<boolean> => {
  try {
    const membership = await ProjectMember.findOne({ user: userId, project: projectId });
    return !!membership;
  } catch (err) {
    log.error(`Error checking project membership: ${err.message}`);
    return false;
  }
};

/**
 * Check if a user is an admin of a project
 */
export const isProjectAdmin = async (userId: string, projectId: string): Promise<boolean> => {
  try {
    const membership = await ProjectMember.findOne({ 
      user: userId, 
      project: projectId, 
      role: ProjectRole.ADMIN 
    });
    return !!membership;
  } catch (err) {
    log.error(`Error checking project admin status: ${err.message}`);
    return false;
  }
};

/**
 * Check if a user has permission to access a project
 * Superusers and admins always have access, otherwise checks membership
 */
export const canAccessProject = async (userId: string, projectId: string): Promise<boolean> => {
  const admin = await isAdmin(userId);
  if (admin) return true;

  return isProjectMember(userId, projectId);
};

/**
 * Check if a user has permission to manage a project (edit/delete project, manage members)
 * Superusers and admins bypass; project_managers must be a project admin
 */
export const canManageProject = async (userId: string, projectId: string): Promise<boolean> => {
  const admin = await isAdmin(userId);
  if (admin) return true;

  const pmOrAbove = await isProjectManagerOrAbove(userId);
  if (pmOrAbove) {
    return isProjectAdmin(userId, projectId);
  }

  return isProjectAdmin(userId, projectId);
};

/**
 * Check if a user can modify a task
 * - Superusers can modify any task
 * - Project admins can modify any task in their project
 * - Task creator can modify their own task
 * - Task assignee can modify their assigned task
 */
export const canModifyTask = async (
  userId: string,
  taskCreatedBy: string,
  taskAssignee: string | null,
  projectId: string | null
): Promise<boolean> => {
  // Superuser and admin can do anything
  const admin = await isAdmin(userId);
  if (admin) return true;
  
  // Task creator can modify
  if (taskCreatedBy === userId) return true;
  
  // Task assignee can modify
  if (taskAssignee && taskAssignee === userId) return true;
  
  // Project admin can modify any task in the project
  if (projectId) {
    const isAdmin = await isProjectAdmin(userId, projectId);
    if (isAdmin) return true;
  }
  
  return false;
};

/**
 * Check if a user can create a task in a project
 * - Superusers can create anywhere
 * - Project members can create tasks in their projects
 * - Anyone can create standalone tasks (no project)
 */
export const canCreateTaskInProject = async (userId: string, projectId: string | null): Promise<boolean> => {
  // No project means standalone task - anyone can create
  if (!projectId) return true;

  // Admin and above can create anywhere
  const admin = await isAdmin(userId);
  if (admin) return true;

  // Must be a project member
  return isProjectMember(userId, projectId);
};

/**
 * Check if a user can assign tasks in a project
 * - Only admins and superusers can assign tasks
 */
export const canAssignTask = async (userId: string, projectId: string | null): Promise<boolean> => {
  // No project means standalone task - only creator can assign (handled elsewhere)
  if (!projectId) return false;

  // Admin and above can assign anywhere
  const admin = await isAdmin(userId);
  if (admin) return true;

  // Must be a project admin
  return isProjectAdmin(userId, projectId);
};
