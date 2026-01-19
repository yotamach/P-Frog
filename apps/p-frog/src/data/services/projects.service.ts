import { AxiosResponse } from "axios";
import { request } from './index';
import { Project } from '@p-frog/data';

export class ProjectsAPI {
    endPoint = 'projects/';

    fetchAll(): Promise<AxiosResponse> {
        return request.get<AxiosResponse>(this.endPoint);
    }

    create(project: Project): Promise<AxiosResponse> {
        return request.post<AxiosResponse>(this.endPoint, {
            data: project
        });
    }

    update(id: string, project: Project): Promise<AxiosResponse> {
        return request.patch<AxiosResponse>(this.endPoint + id, project);
    }

    delete(id: string): Promise<AxiosResponse> {
        return request.delete<AxiosResponse>(this.endPoint + id, {});
    }
}
