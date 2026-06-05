export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  status: 'active' | 'deactivated' | 'blocked';
  createdAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'admin';
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: 'customer' | 'admin';
  status?: 'active' | 'deactivated' | 'blocked';
}

export interface UserListQuery {
  search?: string;
  role?: 'all' | 'admin' | 'customer';
  status?: 'all' | 'active' | 'deactivated' | 'blocked';
  page: number;
  limit: number;
}
