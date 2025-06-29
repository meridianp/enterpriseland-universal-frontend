/**
 * Platform Header Component
 */

import React from 'react';
import { useAuth } from '@/core/providers/AuthProvider';
import { Button } from '@/components/ui/button';

export function PlatformHeader() {
  const { user, logout } = useAuth();
  
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">
            EnterpriseLand Platform
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {user?.email}
          </span>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
