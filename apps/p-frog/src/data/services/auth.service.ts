import { AxiosResponse } from "axios";
import { request } from './index';
import { AuthCredentials, User } from "@p-frog/data";

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