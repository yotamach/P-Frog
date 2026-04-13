import { Logger} from "tslog";
import {SettingsModel } from "@models";
import { CallbackError } from "mongoose";
import { ISettings, Settings } from "@schemas";

const log = new Logger({});

export class SettingsService {

  getSettingsByParams(params: any): Promise<ISettings[]> {
    log.info(`SettingsService.getSettingsByParams: find settings`);
    return Settings.find(params).exec();
  }

  createSettings(settings: SettingsModel): Promise<ISettings> {
    log.info(`SettingsService.createSettings: create settings`);
    return Settings.create(settings);
  }

  updateSettings(settings: SettingsModel, id: string): Promise<ISettings | null> {
    log.info(`SettingsService.updateSettings: findOneAndUpdate settings`);
    return Settings.findOneAndUpdate({ id }, {...settings}, {new: true}).exec();
  }

  deleteSettings(id: string): Promise<ISettings | null> {
    log.info(`SettingsService.deleteSettings: findOneAndUpdate task`);
    return Settings.findByIdAndDelete(id).exec();
  }
}
