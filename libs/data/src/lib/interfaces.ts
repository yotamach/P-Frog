export interface Message {
  message: string;
}

export interface AuthCredentials {
  userName: string;
  password: string;
}

export interface User {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  role?: string;
}

export type Port = string | number;
export type Dict = Record<string, unknown>;
export type GenericDict = Record<string, any>;