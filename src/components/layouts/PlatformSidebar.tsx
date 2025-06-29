/**
 * Platform Sidebar Component
 */

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NavigationItem } from '@/core/module-loader/types';

interface PlatformSidebarProps {
  navigation: NavigationItem[];
}

export function PlatformSidebar({ navigation }: PlatformSidebarProps) {
  const router = useRouter();
  
  return (
    <aside className="w-64 bg-white shadow-sm border-r min-h-screen">
      <nav className="p-4">
        <div className="space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.id}
              href={item.path}
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                router.pathname === item.path
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
}
