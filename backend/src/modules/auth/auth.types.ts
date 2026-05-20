export interface Profile {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface AuthResponse {
  user: Profile;
  accessToken: string;
  refreshToken: string;
}
