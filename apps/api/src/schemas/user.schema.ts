import {
  Document,
  model,
  Model,
  Schema
} from 'mongoose';
import { UserModel } from '@models';

export interface IUser extends Document, UserModel {};

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  token: { type: String },
});

export const User: Model<any, any, any, any> = model('User', UserSchema);