import { request, ApiResponse } from './index';

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
}

export class AuthAPI {
    endPoint = 'auth/'

    login(credentials: AuthCredentials): ApiResponse {
        return request.post(this.endPoint + `login`, credentials);
    }

    signUp(user: User): ApiResponse {
        return request.post(this.endPoint + 'signup', user);
    }

    signOut(id: string): ApiResponse {
        return request.patch(this.endPoint + 'signout/', id);
    }

    getProfile(): ApiResponse {
        return request.get(this.endPoint + 'profile');
    }
}