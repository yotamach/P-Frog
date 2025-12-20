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
export interface Task {
    id?: string;
    title: string;
    description: string;
    startDate: Date | string;
    endDate: Date | string;
}

// Common utility types
export interface Dict<T = any> {
    [key: string]: T;
}
