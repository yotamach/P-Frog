import { SettingsModel } from '@models';
import {
  Document,
  model,
  Model,
  Schema
} from 'mongoose';

export interface ISettings extends Document, SettingsModel {
}

const SettingsSchema: Schema = new Schema({
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  sendTasksEmail: {
    type: Boolean,
    default: false
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
});

export const Settings: Model <ISettings> = model('settings', SettingsSchema);
