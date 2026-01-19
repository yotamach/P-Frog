export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
    CANCELLED = 'CANCELLED'
}

export interface Task {
    id?: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status?: TaskStatus;
    created_by?: string;
    created_at?: string;
    updated_at?: string;
}