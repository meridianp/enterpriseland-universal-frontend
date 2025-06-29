'use client';

import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign,
  ArrowUp,
  ArrowDown,
  Activity,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { LeadAnalytics } from '@/lib/types/leads.types';

interface LeadStatCardsProps {
  analytics: LeadAnalytics;
}

export function LeadStatCards({ analytics }: LeadStatCardsProps) {
  const cards = [
    {
      title: 'Total Leads',
      value: analytics.overview.total_leads,
      icon: Users,
      description: `${analytics.overview.active_leads} active`,
      trend: {
        value: 12,
        isPositive: true,
      },
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Conversion Rate',
      value: `${analytics.overview.conversion_rate.toFixed(1)}%`,
      icon: Target,
      description: `${analytics.overview.converted_leads} converted`,
      trend: {
        value: 3.2,
        isPositive: true,
      },
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Average Score',
      value: analytics.overview.average_lead_score.toFixed(0),
      icon: TrendingUp,
      description: `${analytics.overview.qualified_leads} qualified`,
      progress: analytics.overview.average_lead_score,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Pipeline Value',
      value: `$${(analytics.pipeline.value_by_status.NEW + 
        analytics.pipeline.value_by_status.QUALIFIED + 
        analytics.pipeline.value_by_status.CONTACTED + 
        analytics.pipeline.value_by_status.MEETING_SCHEDULED + 
        analytics.pipeline.value_by_status.PROPOSAL_SENT + 
        analytics.pipeline.value_by_status.NEGOTIATING) / 1000000}M`,
      icon: DollarSign,
      description: 'Total potential value',
      trend: {
        value: 24.5,
        isPositive: true,
      },
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">{card.value}</span>
                  {card.trend && (
                    <div className={`flex items-center gap-1 text-sm ${
                      card.trend.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {card.trend.isPositive ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )}
                      {card.trend.value}%
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{card.description}</p>
                {card.progress !== undefined && (
                  <Progress value={card.progress} className="h-1" />
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function PipelineMetrics({ analytics }: { analytics: LeadAnalytics }) {
  const velocityMetrics = [
    {
      stage: 'New → Qualified',
      days: analytics.performance.velocity_metrics.new_to_qualified,
      icon: Activity,
    },
    {
      stage: 'Qualified → Contacted',
      days: analytics.performance.velocity_metrics.qualified_to_contacted,
      icon: Users,
    },
    {
      stage: 'Contacted → Meeting',
      days: analytics.performance.velocity_metrics.contacted_to_meeting,
      icon: Clock,
    },
    {
      stage: 'Meeting → Proposal',
      days: analytics.performance.velocity_metrics.meeting_to_proposal,
      icon: Target,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Pipeline Velocity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {velocityMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className="h-4 w-4" />
                  <span>{metric.stage}</span>
                </div>
                <p className="text-2xl font-bold">{metric.days.toFixed(1)}d</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}