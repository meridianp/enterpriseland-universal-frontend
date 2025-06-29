'use client';

import { Sidebar } from './sidebar';

// Wrapper component that only renders sidebar on client side
export function ClientSidebar({ className }: { className?: string }) {
  return <Sidebar className={className} />;
}