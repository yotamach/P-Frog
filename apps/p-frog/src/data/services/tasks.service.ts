import { request, ApiResponse } from './index';
import { Task } from '@p-frog/data';

export class TasksAPI {
    endPoint = 'tasks/';

    fetchAll(): ApiResponse {
        return request.get(this.endPoint);
    }

    create(task: Task): ApiResponse {
        return request.post(this.endPoint, {
            data: task
        });
    }

    update(id: string, task: Task): ApiResponse {
        return request.patch(this.endPoint + id, task);
    }

    delete(id: string): ApiResponse {
        return request.delete(this.endPoint + id);
    }
}