import { AxiosResponse } from "axios";
import { request } from './index';

interface AuthCredentials {
    email: string;
    password: string;
}

interface User {
    id?: string;
    email: string;
    password: string;
    name?: string;
}

export class AuthAPI {
    endPoint = 'auth/'

    login(credentials: AuthCredentials): Promise<AxiosResponse> {
        return request.post<AxiosResponse>(this.endPoint + `login`, credentials);
    }

    signUp(user: User): Promise<AxiosResponse> {
        return request.post<AxiosResponse>(this.endPoint + 'signup', {
            data: user
        });
    }

    signOut(id: string): Promise<AxiosResponse> {
        return request.patch<AxiosResponse>(this.endPoint + 'signout/', id);
    }
}