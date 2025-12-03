export interface UserProfile {
  id: string;
  email: string;
  createdAt: string;
  lastLogin: string;
  externalId: string;
  externalProvider: string;
}

export interface ApiError {
  error: string;
  message?: string;
}
