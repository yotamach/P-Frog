import { request, ApiResponse } from './index';
import { SystemRole } from '@p-frog/data';

export class UsersAPI {
  endPoint = 'users/';

  fetchAll(): ApiResponse {
    return request.get(this.endPoint);
  }

  updateRole(id: string, role: SystemRole): ApiResponse {
    return request.patch(`${this.endPoint}${id}/role`, { role });
  }

  deleteUser(id: string): ApiResponse {
    return request.delete(`${this.endPoint}${id}`);
  }
}
