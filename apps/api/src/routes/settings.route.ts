import { Response, Router } from "express";
import { Logger } from "tslog";
import HttpStatus from 'http-status-codes';
import {AppRouter, SettingsModel} from "@models";
import {SettingsService } from "src/services";
import { auth } from "../middleware/authentication";
import { getUserId } from "../middleware/authorization";
import { isAdmin, isSuperuser } from "@controllers";

const log = new Logger({});
const settingsRouter: Router = Router();
const settingsService: SettingsService = new SettingsService();

const canAccessSettings = async (requesterId: string, ownerId: string | undefined): Promise<boolean> => {
  if (ownerId && ownerId === requesterId) return true;
  return (await isAdmin(requesterId)) || (await isSuperuser(requesterId));
};

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: User settings endpoints
 */

/**
 * @swagger
 * /settings/{id}:
 *   get:
 *     summary: Get settings by ID
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Settings retrieved
 */
settingsRouter.get('/:id', auth, async (req: any, res: Response) => {
  const {id} = req.params;
  const requesterId = getUserId(req);
  log.info(`GET /settings/${id} - Fetching settings by id (requester: ${requesterId})`);
  try {
    const [settings] = await settingsService.getSettingsByParams({ _id: id });
    if (!settings || !(await canAccessSettings(requesterId, settings.user?.toString()))) {
      return res.status(HttpStatus.FORBIDDEN).send({ success: false, error: 'Forbidden' });
    }
    log.info(`GET /settings/${id} - Settings retrieved successfully`);
    res.send({ success: true, settings});
  } catch (err) {
    log.error(`GET /settings/${id} - Error: ${err}`);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ success: false, error: 'Failed to fetch settings' });
  }
});

/**
 * @swagger
 * /settings/{id}:
 *   post:
 *     summary: Create settings
 *     tags: [Settings]
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
 *     responses:
 *       200:
 *         description: Settings created
 */
settingsRouter.post('/:id', auth, async (req: any, res: Response) => {
  const {id} = req.params;
  const requesterId = getUserId(req);
  log.info(`POST /settings/${id} - Creating settings (requester: ${requesterId})`);
  try {
    const settings: SettingsModel = { ...req.body, user: requesterId };
    const settingsDetails = await settingsService.createSettings(settings);
    log.info(`POST /settings/${id} - Settings created successfully`);
    res.send(settingsDetails);
  } catch(e) {
    log.error(`POST /settings/${id} - Failed to create settings - ${e}`);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ success: false, error: 'Failed to create settings' });
  }
});

/**
 * @swagger
 * /settings/{id}:
 *   patch:
 *     summary: Update settings
 *     tags: [Settings]
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
 *     responses:
 *       200:
 *         description: Settings updated
 */
settingsRouter.patch('/:id', auth, async (req: any, res: Response) => {
  const {id} = req.params;
  const requesterId = getUserId(req);
  log.info(`PATCH /settings/${id} - Updating settings (requester: ${requesterId})`);
  try {
    const [existing] = await settingsService.getSettingsByParams({ _id: id });
    if (!existing || !(await canAccessSettings(requesterId, existing.user?.toString()))) {
      return res.status(HttpStatus.FORBIDDEN).send({ success: false, error: 'Forbidden' });
    }
    const settingsData: SettingsModel = { ...req.body };
    delete settingsData.user;
    const settings = await settingsService.updateSettings(settingsData, id);
    log.info(`PATCH /settings/${id} - Settings updated successfully`);
    res.send({ success: true, settings});
  } catch (err) {
    log.error(`PATCH /settings/${id} - Error: ${err}`);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ success: false, error: 'Failed to update settings' });
  }
});

/**
 * @swagger
 * /settings/{id}:
 *   delete:
 *     summary: Delete settings
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Settings deleted
 */
settingsRouter.delete('/:id', auth, async (req: any, res: Response) => {
  const {id} = req.params;
  const requesterId = getUserId(req);
  log.info(`DELETE /settings/${id} - Deleting settings (requester: ${requesterId})`);
  try {
    const [existing] = await settingsService.getSettingsByParams({ _id: id });
    if (!existing || !(await canAccessSettings(requesterId, existing.user?.toString()))) {
      return res.status(HttpStatus.FORBIDDEN).send({ success: false, error: 'Forbidden' });
    }
    const settings = await settingsService.deleteSettings(id);
    log.info(`DELETE /settings/${id} - Settings deleted successfully`);
    res.send({ success: true, settings});
  } catch (err) {
    log.error(`DELETE /settings/${id} - Error: ${err}`);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ success: false, error: 'Failed to delete settings' });
  }
});

const settingsRoutes : AppRouter = { url: '/settings', router: settingsRouter};

export default settingsRoutes;
