import { AxiosResponse } from "axios";
import { request } from './index';
import { Task } from '@types';

export class TasksAPI {
    fetchAll(): Promise<AxiosResponse> {
        return request.get<AxiosResponse>(`tasks/`);
    }

    create(task: Task): Promise<AxiosResponse> {
        return request.post<AxiosResponse>(`tasks/`, {
            data: task
        });
    }

    delete(id: string): Promise<AxiosResponse> {
        return request.post<AxiosResponse>(`tasks/`+ id, {});
    }
}