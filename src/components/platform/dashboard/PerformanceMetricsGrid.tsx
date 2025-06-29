'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target, 
  Users, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Award
} from 'lucide-react';
import { usePerformanceMetrics, useDashboardOverview } from '@/lib/hooks/useAnalyticsQueries';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from '@/lib/utils';

interface PerformanceMetricsGridProps {
  className?: string;
  filters?: {
    time_period?: string;
    partner_ids?: string[];
    assessment_statuses?: string[];
  };
}

interface KPICard {
  title: string;
  value: string;
  subtitle: string;
  trend: {
    value: number;
    direction: 'up' | 'down' | 'stable';
    isPositive: boolean;
  };
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  progress?: number;
  benchmark?: {
    value: number;
    label: string;
  };
}

export function PerformanceMetricsGrid({ 
  className,
  filters 
}: PerformanceMetricsGridProps) {
  const { 
    data: performanceData, 
    isLoading: performanceLoading, 
    error: performanceError 
  } = usePerformanceMetrics(filters);

  const { 
    data: dashboardData, 
    isLoading: dashboardLoading, 
    error: dashboardError 
  } = useDashboardOverview(filters);

  const isLoading = performanceLoading || dashboardLoading;
  const error = performanceError || dashboardError;

  // Process KPI data into cards
  const kpiCards = useMemo((): KPICard[] => {
    if (!performanceData?.data || !dashboardData?.data) return [];

    const kpis = performanceData.data.kpis;
    const dashboard = dashboardData.data;

    return [
      {
        title: 'Assessment Throughput',
        value: kpis.assessment_throughput.current_value.toFixed(1),
        subtitle: 'assessments/week',
        trend: {
          value: Math.abs(kpis.assessment_throughput.change_percentage),
          direction: kpis.assessment_throughput.trend_direction,
          isPositive: kpis.assessment_throughput.trend_direction === 'up'
        },
        icon: Zap,
        color: '#215788',
        progress: Math.min(100, (kpis.assessment_throughput.current_value / 20) * 100),
        benchmark: {
          value: 15,
          label: 'Target: 15/week'
        }
      },
      {
        title: 'Completion Rate',
        value: `${dashboard.platform_metrics.assessment_completion_rate.toFixed(1)}%`,
        subtitle: 'assessments completed',
        trend: {
          value: 2.5, // This would come from historical data
          direction: 'up',
          isPositive: true
        },
        icon: CheckCircle,
        color: '#BED600',
        progress: dashboard.platform_metrics.assessment_completion_rate,
        benchmark: {
          value: 85,
          label: 'Target: 85%'
        }
      },
      {
        title: 'Avg. Assessment Time',
        value: '12.5',
        subtitle: 'days to complete',
        trend: {
          value: 8.3,
          direction: 'down',
          isPositive: true // Lower is better for time
        },
        icon: Clock,
        color: '#00B7B2',
        progress: Math.max(0, 100 - ((12.5 / 20) * 100)), // Inverse for time
        benchmark: {
          value: 10,
          label: 'Target: ≤10 days'
        }
      },
      {
        title: 'Risk Score Improvement',
        value: kpis.risk_score_improvement.current_value.toFixed(1),
        subtitle: 'points improved',
        trend: {
          value: Math.abs(kpis.risk_score_improvement.change_percentage),
          direction: kpis.risk_score_improvement.trend_direction,
          isPositive: kpis.risk_score_improvement.trend_direction === 'up'
        },
        icon: Target,
        color: '#E37222',
        progress: Math.min(100, (kpis.risk_score_improvement.current_value / 2) * 100),
        benchmark: {
          value: 1.5,
          label: 'Target: 1.5 pts'
        }
      },
      {
        title: 'Partner Satisfaction',
        value: `${kpis.partner_satisfaction.current_value.toFixed(1)}%`,
        subtitle: 'satisfaction score',
        trend: {
          value: Math.abs(kpis.partner_satisfaction.change_percentage),
          direction: kpis.partner_satisfaction.trend_direction,
          isPositive: kpis.partner_satisfaction.trend_direction === 'up'
        },
        icon: Users,
        color: '#8B5CF6',
        progress: kpis.partner_satisfaction.current_value,
        benchmark: {
          value: 90,
          label: 'Target: 90%'
        }
      },
      {
        title: 'Operational Efficiency',
        value: kpis.operational_efficiency.current_value.toFixed(1),
        subtitle: 'efficiency index',
        trend: {
          value: Math.abs(kpis.operational_efficiency.change_percentage),
          direction: kpis.operational_efficiency.trend_direction,
          isPositive: kpis.operational_efficiency.trend_direction === 'up'
        },
        icon: Award,
        color: '#F59E0B',
        progress: Math.min(100, (kpis.operational_efficiency.current_value / 10) * 100),
        benchmark: {
          value: 8.5,
          label: 'Target: 8.5'
        }
      }
    ];
  }, [performanceData?.data, dashboardData?.data]);

  // Calculate alerts summary
  const alertsSummary = useMemo(() => {
    if (!performanceData?.data?.alerts) return null;

    const alerts = performanceData.data.alerts;
    const total = alerts.high_priority + alerts.medium_priority + alerts.low_priority;

    return {
      total,
      high: alerts.high_priority,
      medium: alerts.medium_priority,
      low: alerts.low_priority,
      criticalPercentage: total > 0 ? (alerts.high_priority / total) * 100 : 0
    };
  }, [performanceData?.data?.alerts]);

  const getTrendIcon = (direction: 'up' | 'down' | 'stable', isPositive: boolean) => {
    if (direction === 'stable') return null;
    
    const IconComponent = direction === 'up' ? TrendingUp : TrendingDown;
    const colorClass = isPositive ? 'text-green-600' : 'text-red-600';
    
    return <IconComponent className={cn('h-4 w-4', colorClass)} />;
  };

  const getTrendColor = (direction: 'up' | 'down' | 'stable', isPositive: boolean) => {
    if (direction === 'stable') return 'text-gray-600';
    return isPositive ? 'text-green-600' : 'text-red-600';
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-4 w-40" />
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
            <Target className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Failed to load performance metrics. Please try again later.
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
            <Target className="h-5 w-5 text-[#215788]" />
            <CardTitle>Performance Metrics</CardTitle>
          </div>
          {alertsSummary && alertsSummary.total > 0 && (
            <Badge 
              variant={alertsSummary.high > 0 ? "destructive" : "secondary"}
              className="flex items-center gap-1"
            >
              <AlertCircle className="h-3 w-3" />
              {alertsSummary.total} alerts
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpiCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div key={index} className="space-y-4">
                {/* KPI Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${card.color}20` }}
                    >
                      <IconComponent 
                        className="h-4 w-4" 
                        style={{ color: card.color }}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{card.title}</h3>
                      <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: card.color }}>
                      {card.value}
                    </div>
                    <div className={cn("flex items-center gap-1 text-xs", getTrendColor(card.trend.direction, card.trend.isPositive))}>
                      {getTrendIcon(card.trend.direction, card.trend.isPositive)}
                      <span>{card.trend.value.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                {card.progress !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{card.progress.toFixed(0)}%</span>
                    </div>
                    <Progress 
                      value={card.progress} 
                      className="h-2"
                      style={{ 
                        backgroundColor: `${card.color}20`,
                      }}
                    />
                  </div>
                )}

                {/* Benchmark Comparison */}
                {card.benchmark && (
                  <div className="space-y-2">
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {card.benchmark.label}
                      </span>
                      <Badge 
                        variant={parseFloat(card.value) >= card.benchmark.value ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {parseFloat(card.value) >= card.benchmark.value ? 'On Track' : 'Below Target'}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Alerts Summary */}
        {alertsSummary && alertsSummary.total > 0 && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Performance Alerts
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-lg font-bold text-red-600">
                  {alertsSummary.high}
                </div>
                <div className="text-xs text-red-600">High Priority</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-lg font-bold text-yellow-600">
                  {alertsSummary.medium}
                </div>
                <div className="text-xs text-yellow-600">Medium Priority</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {alertsSummary.low}
                </div>
                <div className="text-xs text-blue-600">Low Priority</div>
              </div>
            </div>
          </div>
        )}

        {/* Benchmarks Summary */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-medium text-sm mb-3">Benchmark Performance</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Above Target</div>
              <div className="text-2xl font-bold text-green-600">
                {kpiCards.filter(card => 
                  card.benchmark && parseFloat(card.value.replace('%', '')) >= card.benchmark.value
                ).length}
              </div>
              <div className="text-xs text-muted-foreground">
                out of {kpiCards.filter(card => card.benchmark).length} KPIs
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Below Target</div>
              <div className="text-2xl font-bold text-orange-600">
                {kpiCards.filter(card => 
                  card.benchmark && parseFloat(card.value.replace('%', '')) < card.benchmark.value
                ).length}
              </div>
              <div className="text-xs text-muted-foreground">
                needs improvement
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}