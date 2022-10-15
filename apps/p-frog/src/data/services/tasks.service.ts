import { AxiosResponse } from "axios";
import { request } from './index';
import { Task } from '@types';

export class TasksAPI {
    endPoint = 'tasks/';

    fetchAll(): Promise<AxiosResponse> {
        return request.get<AxiosResponse>(this.endPoint);
    }

    create(task: Task): Promise<AxiosResponse> {
        return request.post<AxiosResponse>(this.endPoint, {
            data: task
        });
    }

    update(id: string, task: Task): Promise<AxiosResponse> {
        return request.patch<AxiosResponse>(this.endPoint + id, task);
    }

    delete(id: string): Promise<AxiosResponse> {
        return request.delete<AxiosResponse>(this.endPoint + id, {});
    }
}