import { SystemRole } from '@p-frog/data';

export interface UserModel {
    firstName?: string;
    lastName?: string;
    userName: string;
    email?: string;
    password: string;
    token?: string;
    role?: SystemRole;
}
