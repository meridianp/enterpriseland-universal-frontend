'use client';

import { useState } from 'react';
import { 
  Mail, 
  Phone, 
  Calendar,
  MessageSquare,
  FileText,
  TrendingUp,
  User,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from '@/lib/utils';
import { useLeadActivities } from '@/lib/hooks/use-leads';
import type { LeadActivity, ActivityType } from '@/lib/types/leads.types';
import { formatDistanceToNow, format } from 'date-fns';

interface ActivityTimelineProps {
  leadId: string;
}

export function ActivityTimeline({ leadId }: ActivityTimelineProps) {
  const [page, setPage] = useState(1);
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set());
  
  const { data, isLoading } = useLeadActivities(leadId, {
    page,
    page_size: 20,
  });

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'EMAIL':
        return Mail;
      case 'CALL':
        return Phone;
      case 'MEETING':
        return Calendar;
      case 'NOTE':
        return MessageSquare;
      case 'TASK':
        return FileText;
      case 'SCORE_UPDATE':
        return TrendingUp;
      case 'STATUS_CHANGE':
        return User;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case 'EMAIL':
        return 'bg-blue-100 text-blue-700';
      case 'CALL':
        return 'bg-green-100 text-green-700';
      case 'MEETING':
        return 'bg-purple-100 text-purple-700';
      case 'NOTE':
        return 'bg-gray-100 text-gray-700';
      case 'TASK':
        return 'bg-yellow-100 text-yellow-700';
      case 'SCORE_UPDATE':
        return 'bg-orange-100 text-orange-700';
      case 'STATUS_CHANGE':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const toggleActivityExpansion = (activityId: string) => {
    const newExpanded = new Set(expandedActivities);
    if (newExpanded.has(activityId)) {
      newExpanded.delete(activityId);
    } else {
      newExpanded.add(activityId);
    }
    setExpandedActivities(newExpanded);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const activities = data?.results || [];
  const hasMore = data?.next !== null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
        <CardDescription>
          {data?.count || 0} activities recorded
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />

            {/* Activities */}
            <div className="space-y-6">
              {activities.map((activity, index) => {
                const Icon = getActivityIcon(activity.activity_type);
                const isExpanded = expandedActivities.has(activity.id);

                return (
                  <div key={activity.id} className="relative flex gap-4">
                    {/* Activity icon */}
                    <div 
                      className={cn(
                        'relative z-10 flex h-10 w-10 items-center justify-center rounded-full',
                        getActivityColor(activity.activity_type)
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Activity content */}
                    <div className="flex-1 pb-4">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h4 className="font-semibold">{activity.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{activity.created_by_name || 'System'}</span>
                            <span>•</span>
                            <span>
                              {formatDistanceToNow(new Date(activity.created_at), { 
                                addSuffix: true 
                              })}
                            </span>
                          </div>
                        </div>
                        {activity.description && activity.description.length > 100 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleActivityExpansion(activity.id)}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>

                      {/* Activity description */}
                      <p className={cn(
                        'text-sm text-muted-foreground',
                        !isExpanded && 'line-clamp-2'
                      )}>
                        {activity.description}
                      </p>

                      {/* Activity metadata */}
                      {activity.metadata && (
                        <div className="mt-2 space-y-1">
                          {activity.metadata.old_status && activity.metadata.new_status && (
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {activity.metadata.old_status}
                              </Badge>
                              <span className="text-xs text-muted-foreground">→</span>
                              <Badge variant="outline" className="text-xs">
                                {activity.metadata.new_status}
                              </Badge>
                            </div>
                          )}
                          {activity.metadata.old_score !== undefined && activity.metadata.new_score !== undefined && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">Score:</span>
                              <span className={activity.metadata.old_score < activity.metadata.new_score ? 'text-green-600' : 'text-red-600'}>
                                {activity.metadata.old_score} → {activity.metadata.new_score}
                              </span>
                            </div>
                          )}
                          {activity.metadata.meeting_location && (
                            <p className="text-sm text-muted-foreground">
                              Location: {activity.metadata.meeting_location}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Activity details */}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {activity.duration_minutes && (
                          <Badge variant="secondary" className="text-xs">
                            {activity.duration_minutes} min
                          </Badge>
                        )}
                        {activity.outcome && (
                          <Badge variant="secondary" className="text-xs">
                            {activity.outcome}
                          </Badge>
                        )}
                        {activity.next_action_date && (
                          <Badge variant="secondary" className="text-xs">
                            Next: {format(new Date(activity.next_action_date), 'MMM d')}
                          </Badge>
                        )}
                      </div>

                      {/* Attachments */}
                      {activity.attachments && activity.attachments.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground mb-1">Attachments:</p>
                          <div className="flex flex-wrap gap-1">
                            {activity.attachments.map(attachment => (
                              <Badge key={attachment.id} variant="outline" className="text-xs">
                                {attachment.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                >
                  Load More
                </Button>
              </div>
            )}

            {activities.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No activities recorded yet
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}