'use client';

import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon?: ReactNode;
  className?: string;
}

export function MetricCard({
  title,
  value,
  description,
  change,
  icon,
  className
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (!change) return null;
    
    const iconClass = "h-4 w-4";
    switch (change.type) {
      case 'increase':
        return <ArrowUpIcon className={cn(iconClass, "text-green-600")} />;
      case 'decrease':
        return <ArrowDownIcon className={cn(iconClass, "text-red-600")} />;
      case 'neutral':
        return <MinusIcon className={cn(iconClass, "text-gray-600")} />;
    }
  };

  const getTrendColor = () => {
    if (!change) return '';
    switch (change.type) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      case 'neutral':
        return 'text-gray-600';
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {change && (
          <div className={cn("flex items-center gap-1 mt-2", getTrendColor())}>
            {getTrendIcon()}
            <span className="text-xs font-medium">
              {change.value > 0 ? '+' : ''}{change.value}%
            </span>
            <span className="text-xs text-muted-foreground">from last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}