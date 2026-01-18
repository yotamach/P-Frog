// Mock for TasksAPI service to avoid import.meta.env issues in tests
export class TasksAPI {
  async fetchAll() {
    return { data: { tasks: [] } };
  }

  async create(task: any) {
    return { data: { task } };
  }

  async update(id: string, task: any) {
    return { data: { task: { ...task, id } } };
  }

  async delete(id: string) {
    return { data: { success: true } };
  }
}

export class UsersAPI {
  async login(credentials: any) {
    return { data: { user: {}, token: 'mock-token' } };
  }

  async signup(data: any) {
    return { data: { user: {}, token: 'mock-token' } };
  }

  async getProfile() {
    return { data: { user: {} } };
  }
}
