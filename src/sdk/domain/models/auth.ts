export interface AuthUser {
  id:    string;
  email: string;
  name:  string;
}

export interface LoginCredentials {
  email:    string;
  password: string;
}

export interface LoginResult {
  token:      string;
  expires_at: string;
  user:       AuthUser;
}
