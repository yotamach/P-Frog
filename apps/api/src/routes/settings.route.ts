import { Request, Response, Router } from "express";
import { Logger } from "tslog";
import {AppRouter, SettingsModel} from "@models";
import {SettingsService } from "src/services";

const log = new Logger({});
const settingsRouter: Router = Router();
const settingsService: SettingsService = new SettingsService();

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
settingsRouter.get('/:id', (req: Request, res: Response) => {
  const {id} = req.params;
  log.info(`GET /settings/${id} - Fetching settings by id`);
  settingsService.getSettingsByParams({ id }, (err, settings) => {
    if (err) {
      log.error(`GET /settings/${id} - Error: ${err}`);
      res.send({ success: false, error: err});
    }
    else {
      log.info(`GET /settings/${id} - Settings retrieved successfully`);
      res.send({ success: true, settings});
    }
  });
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
settingsRouter.post('/:id',async (req: Request, res: Response) => {
  const {id} = req.params;
  log.info(`POST /settings/${id} - Creating settings`);
  try {
    const settings: SettingsModel = req.body;
    const settingsDetails = await settingsService.createSettings(settings);
    log.info(`POST /settings/${id} - Settings created successfully`);
    res.send(settingsDetails);
  } catch(e) {
    log.error(`POST /settings/${id} - Failed to create settings - ${e}`);
    res.status(500).send({ success: false, error: e });
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
settingsRouter.patch('/:id', (req: Request, res: Response) => {
  const {id} = req.params;
  log.info(`PATCH /settings/${id} - Updating settings`);
  const settings: SettingsModel = req.body;
  settingsService.updateSettings(settings, id, (err, settings) => {
    if (err) {
      log.error(`PATCH /settings/${id} - Error: ${err}`);
      res.send({ success: false, error: err});
    }
    else {
      log.info(`PATCH /settings/${id} - Settings updated successfully`);
      res.send({ success: true, settings});
    }
  });
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
settingsRouter.delete('/:id', (req: Request, res: Response) => {
  const {id} = req.params;
  log.info(`DELETE /settings/${id} - Deleting settings`);
  settingsService.deleteSettings(id,(err, settings) => {
    if (err) {
      log.error(`DELETE /settings/${id} - Error: ${err}`);
      res.send({ success: false, error: err});
    }
    else {
      log.info(`DELETE /settings/${id} - Settings deleted successfully`);
      res.send({ success: true, settings});
    }
  });
});

const settingsRoutes : AppRouter = { url: '/settings', router: settingsRouter};

export default settingsRoutes;
