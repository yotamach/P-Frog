import {
  Document,
  model,
  Model,
  Schema
} from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
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
  }
});

TaskSchema.set('toJSON', {
  transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
  }
}); 


export const Task: Model <ITask> = model('Task', TaskSchema);
