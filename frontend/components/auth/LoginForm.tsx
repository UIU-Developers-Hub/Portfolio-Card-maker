'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function LoginForm() {
  const { user, setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if already logged in
  if (user) {
    window.location.href = '/dashboard';
    return null;
  }

  const validateForm = (data: { username: string; password: string }) => {
    const newErrors: Record<string, string> = {};

    if (!data.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!data.password) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      username: (formData.get('username') as string).trim(),
      password: formData.get('password') as string,
    };

    // Client-side validation
    const validationErrors = validateForm(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.auth.login(data);
      setAuth(response.user, response.tokens);
      toast.success('Welcome back!');
      
      // Small delay to ensure cookies are set
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 100);
    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof Error) {
        const errorMessage = error.message;
        
        // Handle specific backend error messages
        if (errorMessage.includes('No account found')) {
          setErrors({ username: 'No account found with this username' });
          toast.error('Account not found');
        } else if (errorMessage.includes('Incorrect password')) {
          setErrors({ password: 'Incorrect password' });
          toast.error('Incorrect password');
        } else {
          setErrors({ submit: errorMessage });
          toast.error(errorMessage);
        }
      } else {
        setErrors({ submit: 'An unexpected error occurred' });
        toast.error('Login failed. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            href="/auth/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign up
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            label="Username"
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            error={errors.username}
            disabled={isLoading}
          />
        </div>

        <div>
          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            error={errors.password}
            disabled={isLoading}
          />
        </div>

        {errors.submit && (
          <div className="text-sm text-red-600">{errors.submit}</div>
        )}

        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </Card>
  );
}
