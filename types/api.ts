export interface ApiResponse {
  status: number;
  message?: string;
  error_code?: string;
  errors?: Record<string, string[]>;
  [key: string]: any;
}