import { Logger} from "tslog";
import {SettingsModel } from "@models";
import { CallbackError } from "mongoose";
import { ISettings, Settings } from "@schemas";

const log: Logger = new Logger();

export class SettingsService {

  getSettingsByParams(params: any, callback: (err: CallbackError, settings: ISettings) => void) {
    log.info(`SettingsService.getSettingsByParams: find settings`);
    return Settings.find(params, callback)
  }

  createSettings(settings: SettingsModel): Promise<ISettings> {
    log.info(`SettingsService.createSettings: create settings`);
    return Settings.create(settings);
  }

  updateSettings(settings: SettingsModel, id: string, callback: (err: CallbackError, settings: ISettings) => void) {
    log.info(`SettingsService.updateSettings: findOneAndUpdate settings`);
    return Settings.findOneAndUpdate({ id },{...settings},{new: true}, callback);
  }

  deleteSettings(id: string, callback: (err: CallbackError, settings: ISettings) => void) {
    log.info(`SettingsService.deleteSettings: findOneAndUpdate task`);
    return Settings.findByIdAndDelete(id, callback);
  }
}
