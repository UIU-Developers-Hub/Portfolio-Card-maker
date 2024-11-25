'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from './Navbar';

export default function NavigationProvider() {
  return (
    <AuthProvider>
      <Navbar />
    </AuthProvider>
  );
}
