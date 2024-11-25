'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterForm() {
  const router = useRouter();
  const { user, setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  const validateForm = (data: { username: string; email: string; password: string }) => {
    const newErrors: Record<string, string> = {};

    // Username validation
    if (!data.username) {
      newErrors.username = 'Username is required';
    } else if (data.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    if (!data.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!data.password) {
      newErrors.password = 'Password is required';
    } else if (data.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])/.test(data.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/(?=.*[A-Z])/.test(data.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*\d)/.test(data.password)) {
      newErrors.password = 'Password must contain at least one number';
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
      email: (formData.get('email') as string).trim(),
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
      const response = await api.auth.register(data);
      setAuth(response.user, response.tokens);
      toast.success('Registration successful!');
      router.replace('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error instanceof Error) {
        // Parse the error message for specific field errors
        const errorMessage = error.message;
        if (errorMessage.includes('Username:')) {
          setErrors(prev => ({ ...prev, username: errorMessage.split('Username:')[1].split('\n')[0].trim() }));
        }
        if (errorMessage.includes('Email:')) {
          setErrors(prev => ({ ...prev, email: errorMessage.split('Email:')[1].split('\n')[0].trim() }));
        }
        if (errorMessage.includes('Password:')) {
          setErrors(prev => ({ ...prev, password: errorMessage.split('Password:')[1].split('\n')[0].trim() }));
        }
        if (!errorMessage.includes('Username:') && !errorMessage.includes('Email:') && !errorMessage.includes('Password:')) {
          setErrors(prev => ({ ...prev, submit: errorMessage }));
        }
        toast.error('Please fix the errors and try again');
      } else {
        setErrors({ submit: 'Registration failed. Please try again.' });
        toast.error('Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If user is already logged in, don't render the form
  if (user) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Username"
          name="username"
          type="text"
          autoComplete="username"
          placeholder="Enter your username"
          required
          error={errors.username}
        />

        <Input
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          error={errors.email}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Enter your password"
          required
          error={errors.password}
        />

        {errors.submit && (
          <div className="text-sm text-red-600">{errors.submit}</div>
        )}

        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
    </Card>
  );
}
