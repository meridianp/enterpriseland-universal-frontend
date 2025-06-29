'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard,
  FileText,
  Building,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Assessments',
      href: '/assessments',
      icon: FileText,
    },
    {
      name: 'Partners',
      href: '/partners',
      icon: Building,
    },
    {
      name: 'Schemes',
      href: '/schemes',
      icon: MapPin,
    },
    {
      name: 'Contacts',
      href: '/contacts',
      icon: Users,
    },
  ];

  const isActive = (href: string) => {
    return pathname?.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && <Logo width={32} height={32} />}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center"
              )}
            >
              <item.icon className={cn("h-5 w-5", collapsed && "h-6 w-6")} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}

        {/* Quick Actions */}
        {!collapsed && (
          <div className="pt-4 border-t">
            <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Quick Actions
            </p>
            <Link href="/assessments/new">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                New Assessment
              </Button>
            </Link>
          </div>
        )}
      </nav>
    </aside>
  );
}