import { Request, Response, Router } from "express";
import { UserModel } from '../models/user.model';
import { Logger } from "tslog";
import {AppRouter} from "@models";
import {UserService} from "@controllers";
import { auth } from "../middleware/authentication";
import { requireSuperuser, getUserId } from "../middleware/authorization";
import { isSuperuser } from "@controllers";

const log: Logger = new Logger();
const userRouter: Router = Router();
const userService: UserService = new UserService();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User created
 *       500:
 *         description: Internal server error
 */
userRouter.post('/',async (req: Request, res: Response) => {
  log.info('POST /users - Creating user');
  try {
    const user: UserModel = req.body;
    const userDetails = await userService.createUser(user);
    log.info('POST /users - User created successfully');
    res.send(userDetails);
  } catch(e) {
    log.error(`POST /users - Failed to create user - ${e}`);
    res.status(500).send({ success: false, error: e });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated
 */
userRouter.patch('/:id', (req: Request, res: Response) => {
  const {id} = req.params;
  log.info(`PATCH /users/${id} - Updating user`);
  const user: UserModel = req.body;
  userService.updateUser(user, id, (err, user) => {
    if (err) {
      log.error(`PATCH /users/${id} - Error: ${err}`);
      res.send({ success: false, error: err});
    }
    else {
      log.info(`PATCH /users/${id} - User updated successfully`);
      res.send({ success: true, user});
    }
  });
});

/**
 * @swagger
 * /users/{id}/superuser:
 *   patch:
 *     summary: Set superuser status
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isSuperuser:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Superuser status updated
 *       403:
 *         description: Forbidden
 */

/**
 * PATCH /users/:id/superuser
 * Set superuser status for a user
 * Requires: superuser
 * Body: { isSuperuser: boolean }
 */
userRouter.patch('/:id/superuser', auth, requireSuperuser(), async (req: any, res: Response) => {
  const { id } = req.params;
  const { isSuperuser: newStatus } = req.body;
  const requesterId = getUserId(req);
  
  log.info(`PATCH /users/${id}/superuser - Setting superuser=${newStatus} (requester: ${requesterId})`);
  
  if (typeof newStatus !== 'boolean') {
    return res.status(400).send({ success: false, error: 'isSuperuser must be a boolean' });
  }
  
  // Prevent removing your own superuser status
  if (id === requesterId && !newStatus) {
    return res.status(400).send({ success: false, error: 'Cannot remove your own superuser status' });
  }
  
  try {
    const user = await userService.setSuperuserStatus(id, newStatus);
    if (!user) {
      return res.status(404).send({ success: false, error: 'User not found' });
    }
    log.info(`PATCH /users/${id}/superuser - Superuser status updated successfully`);
    res.send({ success: true, user });
  } catch(e) {
    log.error(`PATCH /users/${id}/superuser - Error: ${e}`);
    res.status(500).send({ success: false, error: e.message });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */
userRouter.get('/:id', (req: Request, res: Response) => {
  const {id} = req.params;
  log.info(`GET /users/${id} - Fetching user by id`);
  userService.getUserByParams({ id }, (err, user) => {
    if (err) {
      log.error(`GET /users/${id} - Error: ${err}`);
      res.send({ success: false, error: err});
    }
    else {
      log.info(`GET /users/${id} - User retrieved successfully`);
      res.send({ success: true, user});
    }
  });
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */

/**
 * GET /users
 * List all users
 * For non-superusers: limited info for searching members
 * For superusers: full user list
 */
userRouter.get('/', auth, async (req: any, res: Response) => {
  const userId = getUserId(req);
  log.info(`GET /users - Fetching all users (requester: ${userId})`);
  
  try {
    const isSuperuserUser = await isSuperuser(userId);
    const users = await userService.getAllUsers();
    
    // Non-superusers get limited fields
    if (!isSuperuserUser) {
      const limitedUsers = users.map(u => ({
        id: u.id,
        userName: u.userName,
        firstName: u.firstName,
        lastName: u.lastName
      }));
      return res.send({ success: true, users: limitedUsers });
    }
    
    log.info(`GET /users - Users retrieved successfully`);
    res.send({ success: true, users });
  } catch(e) {
    log.error(`GET /users - Error: ${e}`);
    res.send({ success: false, error: e.message });
  }
});

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Search users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query (min 2 chars)
 *     responses:
 *       200:
 *         description: Search results
 *       400:
 *         description: Invalid query
 */

/**
 * GET /users/search?q=query
 * Search users by username, email, first name, or last name
 * For finding users to add to projects
 */
userRouter.get('/search', auth, async (req: any, res: Response) => {
  const { q } = req.query;
  log.info(`GET /users/search - Searching for "${q}"`);
  
  if (!q || typeof q !== 'string' || q.length < 2) {
    return res.status(400).send({ success: false, error: 'Search query must be at least 2 characters' });
  }
  
  try {
    const users = await userService.searchUsers(q);
    // Return limited fields
    const results = users.map(u => ({
      id: u.id,
      userName: u.userName,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email
    }));
    res.send({ success: true, users: results });
  } catch(e) {
    log.error(`GET /users/search - Error: ${e}`);
    res.status(500).send({ success: false, error: e.message });
  }
});

const userRoutes : AppRouter = { url: '/users', router: userRouter};

export default userRoutes;
