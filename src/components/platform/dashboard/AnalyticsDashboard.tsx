/**
 * Analytics Dashboard Component
 * 
 * Example implementation showing how to use the new analytics hooks
 * This demonstrates the usage patterns for the analytics API client and React Query hooks
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  useDashboardOverview,
  useAssessmentAnalytics,
  usePartnerAnalytics,
  useSchemeAnalytics,
  useContactAnalytics,
  useRiskAnalytics,
  useRefreshAnalyticsCache,
  useAllAnalytics,
} from '@/lib/hooks/useAnalyticsQueries';
import { TimePeriod, GroupBy } from '@/lib/types/analytics.types';

interface AnalyticsDashboardProps {
  className?: string;
}

export function AnalyticsDashboard({ className }: AnalyticsDashboardProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(TimePeriod.LAST_30_DAYS);
  const [activeTab, setActiveTab] = useState('overview');

  // Using the composite hook for all analytics data
  const allAnalytics = useAllAnalytics(
    { time_period: timePeriod },
    { 
      enabled: true,
      refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    }
  );

  // Cache refresh mutation
  const refreshCache = useRefreshAnalyticsCache();

  const handleRefresh = () => {
    refreshCache.mutate();
  };

  const handleTimePeriodChange = (newPeriod: TimePeriod) => {
    setTimePeriod(newPeriod);
  };

  if (allAnalytics.isLoading) {
    return <AnalyticsSkeleton />;
  }

  if (allAnalytics.isError) {
    return (
      <Alert className="max-w-2xl mx-auto">
        <AlertDescription>
          Failed to load analytics data. Please try refreshing the page.
          {allAnalytics.errors.length > 0 && (
            <div className="mt-2 text-sm">
              Errors: {allAnalytics.errors.map(e => e?.message).join(', ')}
            </div>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your due diligence platform
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Time Period Selector */}
          <div className="flex gap-2">
            {[
              { value: TimePeriod.LAST_7_DAYS, label: '7D' },
              { value: TimePeriod.LAST_30_DAYS, label: '30D' },
              { value: TimePeriod.LAST_90_DAYS, label: '90D' },
              { value: TimePeriod.LAST_6_MONTHS, label: '6M' },
            ].map(({ value, label }) => (
              <Button
                key={value}
                variant={timePeriod === value ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleTimePeriodChange(value)}
              >
                {label}
              </Button>
            ))}
          </div>
          
          {/* Refresh Button */}
          <Button 
            onClick={handleRefresh} 
            disabled={refreshCache.isPending}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshCache.isPending ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs for different analytics views */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="schemes">Schemes</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {allAnalytics.dashboard.data && (
            <OverviewMetrics data={allAnalytics.dashboard.data.data} />
          )}
        </TabsContent>

        {/* Assessments Tab */}
        <TabsContent value="assessments" className="space-y-6">
          {allAnalytics.assessments.data && (
            <AssessmentMetrics data={allAnalytics.assessments.data.data} />
          )}
        </TabsContent>

        {/* Partners Tab */}
        <TabsContent value="partners" className="space-y-6">
          {allAnalytics.partners.data && (
            <PartnerMetrics data={allAnalytics.partners.data.data} />
          )}
        </TabsContent>

        {/* Schemes Tab */}
        <TabsContent value="schemes" className="space-y-6">
          {allAnalytics.schemes.data && (
            <SchemeMetrics data={allAnalytics.schemes.data.data} />
          )}
        </TabsContent>

        {/* Contacts Tab */}
        <TabsContent value="contacts" className="space-y-6">
          {allAnalytics.contacts.data && (
            <ContactMetrics data={allAnalytics.contacts.data.data} />
          )}
        </TabsContent>

        {/* Risk Tab */}
        <TabsContent value="risk" className="space-y-6">
          {allAnalytics.risk.data && (
            <RiskMetrics data={allAnalytics.risk.data.data} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper Components

function OverviewMetrics({ data }: { data: any }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Assessments"
        value={data.platform_metrics.total_assessments}
        description="Active assessments"
        trend={{
          value: data.assessment_summary.pending,
          label: 'pending',
        }}
      />
      <MetricCard
        title="Active Partners"
        value={data.partner_summary.active}
        description={`of ${data.partner_summary.total} total`}
        trend={{
          value: data.partner_summary.active / data.partner_summary.total,
          label: 'active rate',
          isPercentage: true,
        }}
      />
      <MetricCard
        title="Total Beds"
        value={data.scheme_summary.total_beds}
        description="Across all schemes"
        trend={{
          value: data.scheme_summary.in_development,
          label: 'in development',
        }}
      />
      <MetricCard
        title="Active Contacts"
        value={data.contact_summary.total}
        description="Lead conversion"
        trend={{
          value: data.contact_summary.conversion_rate,
          label: 'conversion rate',
          isPercentage: true,
        }}
      />
    </div>
  );
}

function AssessmentMetrics({ data }: { data: any }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.status_breakdown.map((item: any) => (
              <div key={item.status} className="flex justify-between items-center">
                <span className="text-sm">{item.status.replace('_', ' ')}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.count}</span>
                  <Badge variant="secondary">{item.percentage.toFixed(1)}%</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <MetricCard
        title="Average Completion Time"
        value={`${data.avg_completion_time_days} days`}
        description="Time to complete assessment"
      />
      
      <MetricCard
        title="Risk Score"
        value={data.avg_risk_score.toFixed(1)}
        description="Average risk assessment"
        trend={{
          value: data.risk_distribution.high,
          label: 'high risk',
        }}
      />
    </div>
  );
}

function PartnerMetrics({ data }: { data: any }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        title="Active Partners"
        value={data.active_count}
        description={`of ${data.total_count} total`}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Geographic Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.geographic_distribution.slice(0, 5).map((item: any) => (
              <div key={item.country} className="flex justify-between items-center">
                <span className="text-sm">{item.country}</span>
                <Badge variant="outline">{item.percentage.toFixed(1)}%</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <MetricCard
        title="Average Schemes per Partner"
        value={data.schemes_per_partner.avg_schemes.toFixed(1)}
        description={`Max: ${data.schemes_per_partner.max_schemes}`}
      />
    </div>
  );
}

function SchemeMetrics({ data }: { data: any }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        title="Total Schemes"
        value={data.total_count}
        description={`${data.total_beds.toLocaleString()} total beds`}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Development Stages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.development_stage_breakdown.map((item: any) => (
              <div key={item.stage} className="flex justify-between items-center">
                <span className="text-sm">{item.stage.replace('_', ' ')}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.count}</span>
                  <Badge variant="secondary">{item.percentage.toFixed(1)}%</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <MetricCard
        title="Average Scheme Size"
        value={`${data.avg_scheme_size} beds`}
        description={`Largest: ${data.largest_scheme.beds} beds`}
      />
    </div>
  );
}

function ContactMetrics({ data }: { data: any }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        title="Total Contacts"
        value={data.total_count}
        description={`${data.active_count} active`}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Leads</span>
              <span className="text-sm font-medium">{data.conversion_funnel.leads}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Qualified</span>
              <span className="text-sm font-medium">{data.conversion_funnel.qualified}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Opportunities</span>
              <span className="text-sm font-medium">{data.conversion_funnel.opportunities}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Customers</span>
              <span className="text-sm font-medium">{data.conversion_funnel.customers}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <MetricCard
        title="Conversion Rate"
        value={`${(data.conversion_funnel.conversion_rate * 100).toFixed(1)}%`}
        description="Lead to customer"
      />
    </div>
  );
}

function RiskMetrics({ data }: { data: any }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        title="Average Risk Score"
        value={data.avg_risk_score.toFixed(1)}
        description="Overall platform risk"
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Risk Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.risk_distribution.map((item: any) => (
              <div key={item.risk_level} className="flex justify-between items-center">
                <span className="text-sm">{item.risk_level}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.count}</span>
                  <Badge 
                    variant={item.risk_level === 'HIGH' ? 'destructive' : 
                           item.risk_level === 'MEDIUM' ? 'default' : 'secondary'}
                  >
                    {item.percentage.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <MetricCard
        title="High Risk Assessments"
        value={data.high_risk_assessments}
        description="Requiring attention"
      />
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    label: string;
    isPercentage?: boolean;
  };
}

function MetricCard({ title, value, description, trend }: MetricCardProps) {
  const formatTrendValue = (val: number, isPercentage?: boolean) => {
    if (isPercentage) {
      return `${(val * 100).toFixed(1)}%`;
    }
    return val.toLocaleString();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <div className="flex items-center pt-1">
            <span className="text-xs text-muted-foreground">
              {formatTrendValue(trend.value, trend.isPercentage)} {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-12" />
          <Skeleton className="h-9 w-12" />
          <Skeleton className="h-9 w-12" />
          <Skeleton className="h-9 w-12" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AnalyticsDashboard;