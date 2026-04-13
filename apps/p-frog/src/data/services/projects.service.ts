import { request, ApiResponse } from './index';
import { Project } from '@p-frog/data';

export class ProjectsAPI {
    endPoint = 'projects/';

    fetchAll(): ApiResponse {
        return request.get(this.endPoint);
    }

    create(project: Project): ApiResponse {
        return request.post(this.endPoint, {
            data: project
        });
    }

    update(id: string, project: Project): ApiResponse {
        return request.patch(this.endPoint + id, project);
    }

    delete(id: string): ApiResponse {
        return request.delete(this.endPoint + id);
    }
}
