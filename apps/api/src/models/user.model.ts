export interface UserModel {
    firstName?: string;
    lastName?: string;
    userName: string;
    email?: string;
    password: string;
    token?: string;
    isSuperuser?: boolean;
}
