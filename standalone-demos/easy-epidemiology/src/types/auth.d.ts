export type UserRole = 'admin' | 'user' | 'support' | 'pending';
export type UserStatus = 'active' | 'pending' | 'suspended' | 'inactive' | 'approved' | 'rejected' | 'hidden';

export interface User {
  id: string;
  email: string;
  name: string;
  organization?: string;
  role: UserRole;
  isApproved: boolean;
  approved?: boolean; // Legacy field support
  createdAt: string;
  phone?: string;
  affiliation?: string;
  affiliationType?: string;
  status?: UserStatus;
  organizationType?: string;
}

export interface LoginRequest {
  identifier: string;
  password?: string;
  identifierType?: 'email' | 'phone' | 'username';
}

export interface LoginCredentials {
  identifier: string;
  password?: string;
}

export interface RegisterData {
  email: string;
  password?: string;
  name: string;
  organization?: string;
  organizationType?: string;
  phone?: string;
  affiliation?: string;
  affiliationType?: string;
  [key: string]: any;
}

export interface AuthResponse {
  success?: boolean;
  data: {
    token: string;
    user: User;
  };
}

export interface RegisterResponse {
  data: User;
  message?: string;
}
