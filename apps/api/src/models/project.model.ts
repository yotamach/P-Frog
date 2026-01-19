export enum ProjectPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL'
}

export interface ProjectModel {
    title: string;
    description: string;
    dueDate: Date;
    priority?: ProjectPriority;
    owner?: string;
    tasks?: string[]; // Array of task IDs
    created_by?: string;
    created_at?: Date;
    updated_at?: Date;
}
