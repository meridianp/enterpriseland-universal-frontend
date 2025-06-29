'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from '@/lib/utils';
import { getStatusBadgeProps } from '@/lib/utils/assessment.utils';
import { AssessmentStatus } from '@/lib/types/assessment.types';
import { Building2, MapPin, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface TimelineItem {
  id: string;
  title: string;
  type: 'partner' | 'scheme';
  status: AssessmentStatus;
  date: string;
  user: string;
  description?: string;
}

interface AssessmentTimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function AssessmentTimeline({ items, className }: AssessmentTimelineProps) {
  const getStatusIcon = (status: AssessmentStatus) => {
    switch (status) {
      case AssessmentStatus.APPROVED:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case AssessmentStatus.REJECTED:
        return <XCircle className="h-4 w-4 text-red-600" />;
      case AssessmentStatus.IN_REVIEW:
        return <Clock className="h-4 w-4 text-blue-600" />;
      case AssessmentStatus.NEEDS_INFO:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: 'partner' | 'scheme') => {
    return type === 'partner' 
      ? <Building2 className="h-4 w-4" />
      : <MapPin className="h-4 w-4" />;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest assessment updates and changes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No recent activity
            </p>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
              
              {/* Timeline items */}
              <div className="space-y-6">
                {items.map((item, index) => {
                  const statusProps = getStatusBadgeProps(item.status);
                  
                  return (
                    <div key={item.id} className="relative flex gap-4">
                      {/* Timeline dot */}
                      <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background border-2 border-border">
                        {getStatusIcon(item.status)}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {getTypeIcon(item.type)}
                              <h4 className="text-sm font-medium">{item.title}</h4>
                            </div>
                            {item.description && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {item.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{item.user}</span>
                              <span>•</span>
                              <span>{formatDate(item.date)}</span>
                            </div>
                          </div>
                          <Badge className={statusProps.className}>
                            {statusProps.label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}