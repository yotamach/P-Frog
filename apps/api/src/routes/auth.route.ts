import { Request, Response, Router } from "express";
import { Logger } from "tslog";
import {AppRouter} from "@models";
import { AuthService } from "@controllers";

const log = new Logger({});
const authRouter: Router = Router();
const authService: AuthService = new AuthService();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
authRouter.post(
  '/login',
  async (req, res) => {
  log.info('POST /auth/login - Login attempt');
  try {
    const response = await authService.Login(req.body);
    log.info(`POST /auth/login - Login ${response.status === 200 ? 'successful' : 'failed'} - Status: ${response.status}`);
    return res.status(response.status).json(response.resBody);
  } catch (e) {
    log.error(`POST /auth/login - Error: ${e}`);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: User registration
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error or user exists
 *       500:
 *         description: Internal server error
 */
authRouter.post(
  '/signup',
  async (req: Request, res: Response) => {
    log.info('POST /auth/signup - Signup attempt');
    try {
      const response = await authService.SignUp(req.body);
      log.info(`POST /auth/signup - Signup ${response.status === 201 ? 'successful' : 'failed'} - Status: ${response.status}`);
      return res.status(response.status).json(response.resBody);
    } catch (e) {
      log.error(`POST /auth/signup - Error: ${e}`);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
authRouter.get(
  '/profile',
  (req: Request, res: Response) => {
    log.info('GET /auth/profile - Profile access');
    res.json({
      message: 'You made it to the secure route',
      token: req.headers.authorization
    });
    log.info('GET /auth/profile - Profile data sent successfully');
  }
);

const authRoutes : AppRouter = { url: '/auth', router: authRouter};

export default authRoutes;
