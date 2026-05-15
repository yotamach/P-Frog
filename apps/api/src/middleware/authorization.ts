import HttpStatus from 'http-status-codes';
import { Logger } from "tslog";
import * as PermissionService from '@controllers';
import { ProjectRole } from '@schemas';

const log = new Logger({});

/**
 * Extract user ID from request (set by auth middleware)
 */
export const getUserId = (req: any): string | null => {
  return req.user?.id || null;
};

/**
 * Middleware factory: Require user to be a superuser
 */
export const requireSuperuser = () => {
  return async (req: any, res: any, next: any) => {
    const userId = getUserId(req);
    
    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        success: false,
        data: "Unauthorized: User not authenticated"
      });
    }

    try {
      const isSuperuser = await PermissionService.isSuperuser(userId);
      
      if (!isSuperuser) {
        log.warn(`Superuser access denied for user ${userId}`);
        return res.status(HttpStatus.FORBIDDEN).send({
          success: false,
          data: "Forbidden: Superuser access required"
        });
      }

      next();
    } catch (err) {
      log.error(`Authorization error: ${err.message}`);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        success: false,
        data: "Internal server error during authorization"
      });
    }
  };
};

/**
 * Middleware factory: Require user to have specific role(s) in the project
 * Project ID is extracted from req.params.projectId
 * Superusers bypass this check
 * 
 * @param roles - Array of allowed roles (e.g., [ProjectRole.ADMIN, ProjectRole.MEMBER])
 */
export const requireProjectRole = (...roles: ProjectRole[]) => {
  return async (req: any, res: any, next: any) => {
    const userId = getUserId(req);
    const projectId = req.params.projectId || req.params.id;

    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        success: false,
        data: "Unauthorized: User not authenticated"
      });
    }

    if (!projectId) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        success: false,
        data: "Bad Request: Project ID required"
      });
    }

    try {
      // Admins and superusers bypass role checks
      const isAdmin = await PermissionService.isAdmin(userId);
      if (isAdmin) {
        req.isSuperuser = true;
        return next();
      }

      const userRole = await PermissionService.getUserProjectRole(userId, projectId);
      
      if (!userRole) {
        log.warn(`Access denied: User ${userId} is not a member of project ${projectId}`);
        return res.status(HttpStatus.FORBIDDEN).send({
          success: false,
          data: "Forbidden: You are not a member of this project"
        });
      }

      if (!roles.includes(userRole)) {
        log.warn(`Access denied: User ${userId} has role ${userRole}, required one of: ${roles.join(', ')}`);
        return res.status(HttpStatus.FORBIDDEN).send({
          success: false,
          data: `Forbidden: Required role(s): ${roles.join(' or ')}`
        });
      }

      req.projectRole = userRole;
      next();
    } catch (err) {
      log.error(`Authorization error: ${err.message}`);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        success: false,
        data: "Internal server error during authorization"
      });
    }
  };
};

/**
 * Middleware factory: Require user to be a member of the project (any role)
 * Project ID is extracted from req.params.projectId or req.params.id
 * Superusers bypass this check
 */
export const requireProjectMember = () => {
  return requireProjectRole(ProjectRole.ADMIN, ProjectRole.MEMBER);
};

/**
 * Middleware factory: Require user to be an admin of the project
 * Project ID is extracted from req.params.projectId or req.params.id
 * Superusers bypass this check
 */
export const requireProjectAdmin = () => {
  return requireProjectRole(ProjectRole.ADMIN);
};

/**
 * Middleware factory: Require user to be an admin or superuser
 */
export const requireAdmin = () => {
  return async (req: any, res: any, next: any) => {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        success: false,
        data: "Unauthorized: User not authenticated"
      });
    }

    try {
      const isAdmin = await PermissionService.isAdmin(userId);

      if (!isAdmin) {
        log.warn(`Admin access denied for user ${userId}`);
        return res.status(HttpStatus.FORBIDDEN).send({
          success: false,
          data: "Forbidden: Admin access required"
        });
      }

      next();
    } catch (err) {
      log.error(`Authorization error: ${err.message}`);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        success: false,
        data: "Internal server error during authorization"
      });
    }
  };
};

/**
 * Middleware factory: Require user to be project_manager, admin, or superuser
 */
export const requireProjectManagerOrAbove = () => {
  return async (req: any, res: any, next: any) => {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        success: false,
        data: "Unauthorized: User not authenticated"
      });
    }

    try {
      const isPmOrAbove = await PermissionService.isProjectManagerOrAbove(userId);

      if (!isPmOrAbove) {
        log.warn(`Project manager access denied for user ${userId}`);
        return res.status(HttpStatus.FORBIDDEN).send({
          success: false,
          data: "Forbidden: Project manager or above required"
        });
      }

      next();
    } catch (err) {
      log.error(`Authorization error: ${err.message}`);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        success: false,
        data: "Internal server error during authorization"
      });
    }
  };
};

/**
 * Middleware: Attach permission context to request for use in route handlers
 * Does not block - just adds permission info to the request
 */
export const attachPermissionContext = () => {
  return async (req: any, res: any, next: any) => {
    const userId = getUserId(req);

    if (!userId) {
      return next();
    }

    try {
      req.permissionContext = {
        isSuperuser: await PermissionService.isSuperuser(userId),
        isAdmin: await PermissionService.isAdmin(userId),
        userId
      };
      next();
    } catch (err) {
      log.error(`Error attaching permission context: ${err.message}`);
      next();
    }
  };
};
