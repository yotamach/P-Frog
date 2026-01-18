import { AxiosResponse } from "axios";
import { request } from './index';

interface AuthCredentials {
    userName: string;
    password: string;
}

interface User {
    id?: string;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    userName: string;
}

export class AuthAPI {
    endPoint = 'auth/'

    login(credentials: AuthCredentials): Promise<AxiosResponse> {
        return request.post<AxiosResponse>(this.endPoint + `login`, credentials);
    }

    signUp(user: User): Promise<AxiosResponse> {
        return request.post<AxiosResponse>(this.endPoint + 'signup', user);
    }

    signOut(id: string): Promise<AxiosResponse> {
        return request.patch<AxiosResponse>(this.endPoint + 'signout/', id);
    }

    getProfile(): Promise<AxiosResponse> {
        return request.get<AxiosResponse>(this.endPoint + 'profile');
    }
}