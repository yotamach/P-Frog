import {
  Document,
  model,
  Model,
  Schema
} from 'mongoose';

export enum ProjectRole {
  ADMIN = 'admin',
  MEMBER = 'member'
}

export interface IProjectMember extends Document {
  project: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  role: ProjectRole;
  created_at: Date;
  updated_at: Date;
}

const ProjectMemberSchema: Schema = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: Object.values(ProjectRole),
    default: ProjectRole.MEMBER,
    required: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Ensure unique membership per user per project
ProjectMemberSchema.index({ project: 1, user: 1 }, { unique: true });

ProjectMemberSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

export const ProjectMember: Model<IProjectMember> = model<IProjectMember>('ProjectMember', ProjectMemberSchema);
