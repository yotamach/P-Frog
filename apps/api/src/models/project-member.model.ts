export enum ProjectRole {
  ADMIN = 'admin',
  MEMBER = 'member'
}

export interface ProjectMemberModel {
  id?: string;
  project: string;
  user: string;
  role: ProjectRole;
  created_at?: Date;
  updated_at?: Date;
}

// Populated version with user details
export interface ProjectMemberWithUser extends Omit<ProjectMemberModel, 'user'> {
  user: {
    id: string;
    userName: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}
