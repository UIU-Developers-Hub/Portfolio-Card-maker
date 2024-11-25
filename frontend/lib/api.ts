// API base URL - make sure this matches your Django backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:9090/api';

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  username: string;
  password: string;
}

interface ApiResponse<T> {
  data: T;
  message: string;
}

interface AuthResponse {
  user: {
    id: number;
    username: string;
    email: string;
  };
  tokens: {
    access: string;
    refresh: string;
  };
}

// Helper function to get stored tokens from cookies
const getStoredTokens = () => {
  const tokensStr = document.cookie.split('; ').find(row => row.startsWith('auth_tokens='));
  if (tokensStr) {
    try {
      return JSON.parse(decodeURIComponent(tokensStr.split('=')[1]));
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const api = {
  auth: {
    async register(data: RegisterData): Promise<AuthResponse> {
      try {
        const response = await fetch(`${API_BASE_URL}/accounts/register/`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
          let errorMessage = 'Registration failed';

          // Handle specific field errors
          if (responseData.username) {
            errorMessage = `Username: ${responseData.username.join(', ')}`;
          } else if (responseData.email) {
            errorMessage = `Email: ${responseData.email.join(', ')}`;
          } else if (responseData.password) {
            errorMessage = `Password: ${responseData.password.join(', ')}`;
          } else if (responseData.detail) {
            errorMessage = responseData.detail;
          }

          throw new Error(errorMessage);
        }

        return responseData;
      } catch (error) {
        console.error('Registration error:', error);
        throw error;
      }
    },

    async login(data: LoginData): Promise<AuthResponse> {
      try {
        const response = await fetch(`${API_BASE_URL}/accounts/login/`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.detail || 'Login failed');
        }

        return responseData;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },

    async logout(): Promise<void> {
      try {
        const tokens = getStoredTokens();
        if (!tokens?.access || !tokens?.refresh) {
          throw new Error('No tokens found');
        }

        const response = await fetch(`${API_BASE_URL}/accounts/logout/`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokens.access}`,
          },
          body: JSON.stringify({
            refresh_token: tokens.refresh
          }),
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.detail || 'Logout failed');
        }

        return responseData;
      } catch (error) {
        console.error('Logout error:', error);
        throw error;
      }
    },
  },
};
