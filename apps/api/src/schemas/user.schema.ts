import {
  Document,
  model,
  Model,
  Schema
} from 'mongoose';
import { UserModel } from '@models';
import { SystemRole } from '@p-frog/data';

export { SystemRole };

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
  role: {
    type: String,
    enum: Object.values(SystemRole),
    default: SystemRole.MEMBER
  }
});

UserSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    delete ret.token;
  }
});

export const User: Model<IUser> = model<IUser>('User', UserSchema);