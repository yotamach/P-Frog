// User types
export interface User {
    id?: string;
    firstName?: string;
    lastName?: string;
    userName: string;
    email?: string;
    password: string;
    isSuperuser?: boolean;
}

// Project Role types
export enum ProjectRole {
    ADMIN = 'admin',
    MEMBER = 'member'
}

export interface ProjectMember {
    id?: string;
    project: string;
    user: string | User;
    role: ProjectRole;
    created_at?: Date;
    updated_at?: Date;
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
    members?: ProjectMember[];
}

export interface Task {
    id?: string;
    title: string;
    description: string;
    startDate: Date | string;
    endDate: Date | string;
    status?: TaskStatus;
    project?: string | Project;
    assignee?: string | User;
}

// Common utility types
export interface Dict<T = any> {
    [key: string]: T;
}

// Re-export project types
export * from './project.types';
