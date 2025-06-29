/**
 * Universal Platform Layout
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { moduleLoader, moduleRegistry } from '@/core/module-loader';
import { PlatformHeader } from './PlatformHeader';
import { PlatformSidebar } from './PlatformSidebar';
import { PlatformFooter } from './PlatformFooter';

interface UniversalLayoutProps {
  children: React.ReactNode;
}

export function UniversalLayout({ children }: UniversalLayoutProps) {
  const [modulesLoaded, setModulesLoaded] = useState(false);
  const [navigation, setNavigation] = useState([]);
  
  useEffect(() => {
    async function initializeModules() {
      try {
        // Discover available modules
        await moduleRegistry.discoverModules();
        
        // Auto-load user's modules
        await moduleRegistry.autoLoadModules();
        
        // Get navigation from loaded modules
        const nav = moduleLoader.getNavigation();
        setNavigation(nav);
        
        setModulesLoaded(true);
      } catch (error) {
        console.error('Failed to initialize modules:', error);
      }
    }
    
    initializeModules();
  }, []);
  
  if (!modulesLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading modules...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <PlatformHeader />
      
      <div className="flex">
        <PlatformSidebar navigation={navigation} />
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      
      <PlatformFooter />
    </div>
  );
}
