
export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  role: string;
}

export interface User {
  id: number;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  token?: string;
  error?: string;
  message?: string;
  passwordStrength?: number;
  strengthFeedback?: string;
  isBreached?: boolean;
}
