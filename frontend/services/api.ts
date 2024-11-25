import { User, AuthTokens } from '@/types/auth';
import Cookies from 'js-cookie';

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PortfolioData {
  projects: Array<{
    id: string;
    title: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    year: string;
  }>;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  skills: string[];
  socialLinks: Array<{
    platform: string;
    url: string;
  }>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9090';

export class ApiService {
  private static getAuthHeaders(): Record<string, string> {
    const tokens = Cookies.get('auth_tokens');
    if (tokens) {
      try {
        const { access } = JSON.parse(tokens);
        return {
          'Authorization': `Bearer ${access}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        };
      } catch (e) {
        console.error('Error parsing auth tokens:', e);
      }
    }
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  private static async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      ...this.getAuthHeaders(),
      ...options.headers,
    } as HeadersInit;

    try {
      console.log(`Making API request to: ${url}`, {
        method: options.method || 'GET',
        headers: headers,
        body: options.body ? JSON.parse(options.body as string) : undefined
      });

      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // For handling cookies
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If JSON parsing fails, use the default error message
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data as ApiResponse<any>;
    } catch (error) {
      console.error('API Request failed:', {
        url,
        method: options.method || 'GET',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  // Portfolio Data
  static async getPortfolioData(): Promise<ApiResponse<PortfolioData>> {
    return this.fetchWithAuth('/api/portfolio/');
  }

  static async updatePortfolioData(data: Partial<PortfolioData>): Promise<ApiResponse<PortfolioData>> {
    return this.fetchWithAuth('/api/portfolio/', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // User Profile
  static async getUserProfile(): Promise<ApiResponse<User>> {
    return this.fetchWithAuth('/api/accounts/profile/');
  }

  static async updateUserProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.fetchWithAuth('/api/accounts/profile/', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Authentication
  static async login(credentials: { username: string; password: string }): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    return this.fetchWithAuth('/api/accounts/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  static async register(userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    return this.fetchWithAuth('/api/accounts/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  static async logout(): Promise<ApiResponse<void>> {
    try {
      const tokens = Cookies.get('auth_tokens');
      const body: { refresh_token?: string } = {};
      
      if (tokens) {
        try {
          const parsedTokens = JSON.parse(tokens);
          body.refresh_token = parsedTokens.refresh;
        } catch (e) {
          console.error('Error parsing tokens:', e);
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/accounts/logout/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(body),
      });

      Cookies.remove('auth_tokens');
      return { data: undefined };
    } catch (e) {
      console.error('Logout error:', e);
      Cookies.remove('auth_tokens');
      return { data: undefined };
    }
  }

  // Password Reset
  static async requestPasswordReset(email: string): Promise<ApiResponse<void>> {
    return this.fetchWithAuth('/api/accounts/forgot-password/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  static async resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
    return this.fetchWithAuth('/api/accounts/reset-password/', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }
}
