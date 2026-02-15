export enum ProjectPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  dueDate: Date | string;
  priority?: ProjectPriority;
  tasks?: string[]; // Array of task IDs
  created_by?: string;
  created_at?: Date;
  updated_at?: Date;
}
