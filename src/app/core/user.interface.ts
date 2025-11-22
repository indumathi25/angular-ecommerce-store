export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  token?: string; // Fallback for some APIs
}
