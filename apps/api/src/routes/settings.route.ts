import { Request, Response, Router } from "express";
import { Logger } from "tslog";
import {AppRouter, SettingsModel} from "@models";
import {SettingsService } from "src/services";

const log: Logger = new Logger();
const settingsRouter: Router = Router();
const settingsService: SettingsService = new SettingsService();

settingsRouter.get('/:id', (req: Request, res: Response) => {
  log.info(`settingsRouter.get`);
  const {id} = req.params;
  settingsService.getSettingsByParams({ id }, (err, settings) => {
    if (err) {
      res.send({ success: false, error: err});
    }
    else {
      res.send({ success: true, settings});
    }
  });
});

settingsRouter.post('/:id',async (req: Request, res: Response) => {
  log.info("settingsRouter.post");
  try {
    const settings: SettingsModel = req.body;
    const settingsDetails = await settingsService.createSettings(settings);
    log.info(`settingsRouter.post: Settings created succsfully! ${settingsDetails}`);
    res.send(settingsDetails);
  } catch(e) {
    log.error(`settingsRouter.post: Failed to create Settings - ${e}`);
    res.send(e);
  }
});

settingsRouter.patch('/:id', (req: Request, res: Response) => {
  log.info("settingsRouter.patch");
  const settings: SettingsModel = req.body;
  const {id} = req.params;
  settingsService.updateSettings(settings, id, (err, settings) => {
    if (err) {
      res.send({ success: false, error: err});
    }
    else {
      res.send({ success: true, settings});
    }
  });
});

settingsRouter.delete('/:id', (req: Request, res: Response) => {
  log.info("settingsRouter.delete");
  const {id} = req.params;
  settingsService.deleteSettings(id,(err, settings) => {
    if (err) {
      res.send({ success: false, error: err});
    }
    else {
      res.send({ success: true, settings});
    }
  });
});

const settingsRoutes : AppRouter = { url: '/settings', router: settingsRouter};

export default settingsRoutes;
