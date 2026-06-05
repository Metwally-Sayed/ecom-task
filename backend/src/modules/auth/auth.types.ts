export interface Profile {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  status: 'active' | 'deactivated' | 'blocked';
  createdAt: string;
}

export interface AuthResponse {
  user: Profile;
  accessToken: string;
  refreshToken: string;
}
