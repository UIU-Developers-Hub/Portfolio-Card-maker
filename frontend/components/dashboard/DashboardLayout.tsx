'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { 
  RiDashboardLine, 
  RiEdit2Line, 
  RiShareLine,
  RiLogoutBoxLine,
  RiMenuLine,
  RiCloseLine,
  RiContactsLine
} from 'react-icons/ri';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: RiDashboardLine },
  { name: 'Edit Portfolio', href: '/dashboard/edit', icon: RiEdit2Line },
  { name: 'My Card', href: '/dashboard/card', icon: RiContactsLine },
  { name: 'Share Profile', href: '/dashboard/share', icon: RiShareLine },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-gray-900/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={twMerge(
          'fixed top-0 left-0 z-40 w-64 h-screen transition-transform lg:translate-x-0 lg:relative',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-full flex flex-col bg-white border-r border-gray-200">
          <div className="flex h-14 items-center justify-between px-4 border-b border-gray-200">
            <Link href="/dashboard" className="text-xl font-bold text-gray-900">
              Portfolio Maker
            </Link>
            <button
              className="p-2 rounded-md lg:hidden hover:bg-gray-100"
              onClick={toggleSidebar}
            >
              <RiCloseLine className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 flex flex-col gap-1 p-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={twMerge(
                    'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg',
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-gray-200">
            <button
              className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
              onClick={() => {
                // TODO: Implement logout
              }}
            >
              <RiLogoutBoxLine className="w-5 h-5" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-gray-200 bg-white px-4 shadow-sm">
          <button
            className="p-2 rounded-md lg:hidden hover:bg-gray-100"
            onClick={toggleSidebar}
          >
            <RiMenuLine className="w-6 h-6" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700">Welcome back, User!</div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
