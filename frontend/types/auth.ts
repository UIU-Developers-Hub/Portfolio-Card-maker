export interface User {
  id?: number;
  username?: string;
  email?: string;
  fullName?: string;
  title?: string;
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}
