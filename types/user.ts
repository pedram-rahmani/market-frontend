// types/user.ts
export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  phone?: string;
  role: "admin" | "co-admin" | "user" | string;
  permissions?: string[];
  status?: "active" | "banned" | string;
  admin_notes?: string;
  api_token?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  [key: string]: any;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}