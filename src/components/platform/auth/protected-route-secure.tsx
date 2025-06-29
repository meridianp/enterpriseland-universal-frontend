'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authSecure } from '@/lib/auth-secure';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  fallbackUrl?: string;
}

export function ProtectedRouteSecure({ 
  children, 
  requiredPermission,
  fallbackUrl = '/login' 
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check if user is authenticated by making a request to the server
      const authenticated = await authSecure.checkAuthStatus();
      
      if (!authenticated) {
        router.push(fallbackUrl);
        return;
      }

      // Check permission if required
      if (requiredPermission) {
        const user = authSecure.getUser();
        if (!user || !authSecure.hasPermission(requiredPermission, user.role)) {
          router.push('/unauthorized');
          return;
        }
      }

      setIsAuthorized(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push(fallbackUrl);
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}