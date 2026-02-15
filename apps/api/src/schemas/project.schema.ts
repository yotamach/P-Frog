import {
  Document,
  model,
  Model,
  Schema
} from 'mongoose';

export enum ProjectPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface IProject extends Document {
  title: string;
  description: string;
  dueDate: Date;
  priority: ProjectPriority;
  tasks: Schema.Types.ObjectId[];
  created_by: Schema.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const ProjectSchema: Schema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    default: 'N/A'
  },
  dueDate: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: Object.values(ProjectPriority),
    default: ProjectPriority.MEDIUM,
    required: true
  },
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }],
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

ProjectSchema.set('toJSON', {
  transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
  }
}); 

export const Project: Model<IProject> = model<IProject>('Project', ProjectSchema);
