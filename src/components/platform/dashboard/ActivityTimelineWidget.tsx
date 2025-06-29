'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Activity, 
  FileText, 
  Users, 
  Building2, 
  Phone, 
  RefreshCw,
  Clock,
  User,
  Filter
} from 'lucide-react';
import { useDashboardOverview } from '@/lib/hooks/useAnalyticsQueries';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RecentActivity } from '@/lib/types/analytics.types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ActivityTimelineWidgetProps {
  className?: string;
  maxItems?: number;
  filters?: {
    time_period?: string;
    activity_types?: string[];
  };
}

const ACTIVITY_ICONS = {
  assessment: FileText,
  partner: Users,
  scheme: Building2,
  contact: Phone,
} as const;

const ACTIVITY_COLORS = {
  assessment: '#215788', // Deep Blue
  partner: '#00B7B2',    // Turquoise
  scheme: '#BED600',     // Green
  contact: '#E37222',    // Orange
} as const;

const ACTIVITY_LABELS = {
  assessment: 'Assessment',
  partner: 'Partner',
  scheme: 'Scheme',
  contact: 'Contact',
} as const;

export function ActivityTimelineWidget({ 
  className,
  maxItems = 20,
  filters 
}: ActivityTimelineWidgetProps) {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('24h');
  const [autoRefresh, setAutoRefresh] = useState(false);

  const { 
    data: dashboardData, 
    isLoading, 
    error,
    refetch
  } = useDashboardOverview(filters, {
    refetchInterval: autoRefresh ? 30000 : false, // Refresh every 30 seconds if enabled
  });

  // Process and filter activities
  const filteredActivities = useMemo(() => {
    if (!dashboardData?.data?.recent_activity) return [];

    let activities = [...dashboardData.data.recent_activity];

    // Filter by type
    if (selectedType !== 'all') {
      activities = activities.filter(activity => activity.type === selectedType);
    }

    // Filter by time
    const now = new Date();
    const timeFilters = {
      '1h': 1 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    };

    if (timeFilter !== 'all' && timeFilter in timeFilters) {
      const cutoff = new Date(now.getTime() - timeFilters[timeFilter as keyof typeof timeFilters]);
      activities = activities.filter(activity => 
        new Date(activity.timestamp) >= cutoff
      );
    }

    // Sort by timestamp (newest first)
    activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Limit to maxItems
    return activities.slice(0, maxItems);
  }, [dashboardData?.data?.recent_activity, selectedType, timeFilter, maxItems]);

  // Group activities by date for better organization
  const groupedActivities = useMemo(() => {
    const groups: Record<string, RecentActivity[]> = {};
    
    filteredActivities.forEach(activity => {
      const date = new Date(activity.timestamp);
      const dateKey = date.toDateString();
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(activity);
    });

    return Object.entries(groups).sort(([a], [b]) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  }, [filteredActivities]);

  // Activity type counts for badges
  const activityCounts = useMemo(() => {
    if (!dashboardData?.data?.recent_activity) return {};

    return dashboardData.data.recent_activity.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [dashboardData?.data?.recent_activity]);

  const handleRefresh = () => {
    refetch();
  };

  const getActivityIcon = (type: keyof typeof ACTIVITY_ICONS) => {
    const IconComponent = ACTIVITY_ICONS[type] || Activity;
    return IconComponent;
  };

  const getActivityColor = (type: keyof typeof ACTIVITY_COLORS) => {
    return ACTIVITY_COLORS[type] || '#3C3C3B';
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  const getActionBadgeVariant = (action: string) => {
    if (action.includes('created') || action.includes('added')) return 'default';
    if (action.includes('updated') || action.includes('modified')) return 'secondary';
    if (action.includes('deleted') || action.includes('removed')) return 'destructive';
    if (action.includes('completed') || action.includes('approved')) return 'default';
    return 'outline';
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Failed to load recent activity. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-[#215788]" />
            <CardTitle>Recent Activity</CardTitle>
            {autoRefresh && (
              <Badge variant="outline" className="text-xs">
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                Live
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={cn(autoRefresh && "bg-[#215788] text-white")}
            >
              <Activity className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(ACTIVITY_LABELS).map(([type, label]) => (
                  <SelectItem key={type} value={type}>
                    {label} ({activityCounts[type] || 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last Week</SelectItem>
                <SelectItem value="30d">Last Month</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Activity Type Summary */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(ACTIVITY_LABELS).map(([type, label]) => {
              const count = activityCounts[type] || 0;
              const color = getActivityColor(type as keyof typeof ACTIVITY_COLORS);
              return (
                <Badge 
                  key={type} 
                  variant="outline" 
                  className="text-xs"
                  style={{ borderColor: color, color }}
                >
                  {label}: {count}
                </Badge>
              );
            })}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Activity Timeline */}
        <ScrollArea className="h-[400px]">
          {groupedActivities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No recent activity found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-6">
              {groupedActivities.map(([date, activities]) => (
                <div key={date}>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <h4 className="text-sm font-medium text-muted-foreground">
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h4>
                  </div>
                  <div className="space-y-3 ml-6">
                    {activities.map((activity) => {
                      const IconComponent = getActivityIcon(activity.type as keyof typeof ACTIVITY_ICONS);
                      const color = getActivityColor(activity.type as keyof typeof ACTIVITY_COLORS);
                      
                      return (
                        <div key={activity.id} className="flex gap-3 group">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${color}20` }}
                          >
                            <IconComponent 
                              className="h-4 w-4" 
                              style={{ color }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {activity.description}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge 
                                    variant={getActionBadgeVariant(activity.action)}
                                    className="text-xs"
                                  >
                                    {activity.action}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {activity.user}
                                  </span>
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                {formatTimestamp(activity.timestamp)}
                              </div>
                            </div>
                            {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                              <div className="mt-2 p-2 bg-[#F4F1E9] rounded text-xs">
                                <div className="flex flex-wrap gap-1">
                                  {Object.entries(activity.metadata).map(([key, value]) => (
                                    <span key={key} className="text-muted-foreground">
                                      {key}: {String(value)}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Filter className="h-3 w-3" />
              Showing {filteredActivities.length} of {dashboardData?.data?.recent_activity?.length || 0} activities
            </div>
            <div>
              Last updated: {formatTimestamp(new Date().toISOString())}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}