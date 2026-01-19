// User types
export interface User {
    id?: string;
    firstName?: string;
    lastName?: string;
    userName: string;
    email?: string;
    password: string;
    role?: string;
}

// Authentication types
export interface AuthCredentials {
    userName: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

// Task types
export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
    CANCELLED = 'CANCELLED'
}

export interface Project {
    id?: string;
    title: string;
    description: string;
    startDate: Date | string;
    endDate: Date | string;
    dueDate?: Date | string;
    priority?: string;
    tasks?: Task[];
}

export interface Task {
    id?: string;
    title: string;
    description: string;
    startDate: Date | string;
    endDate: Date | string;
    status?: TaskStatus;
    project?: string | Project;
}

// Common utility types
export interface Dict<T = any> {
    [key: string]: T;
}

// Re-export project types
export * from './project.types';
