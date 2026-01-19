import {
  Document,
  model,
  Model,
  Schema
} from 'mongoose';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED'
}

export interface ITask extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: TaskStatus;
  project?: Schema.Types.ObjectId;
  created_by: Schema.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const TaskSchema: Schema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    default: 'N/A'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(TaskStatus),
    default: TaskStatus.TODO,
    required: true
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: false
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

TaskSchema.set('toJSON', {
  transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
  }
}); 


export const Task: Model<ITask> = model<ITask>('Task', TaskSchema);
