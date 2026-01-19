export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
    CANCELLED = 'CANCELLED'
}

export interface TaskModel {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    status?: TaskStatus;
    created_by?: string;
    created_at?: Date;
    updated_at?: Date;
}
