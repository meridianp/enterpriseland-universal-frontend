'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Shield, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { useRiskAnalytics } from '@/lib/hooks/useAnalyticsQueries';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RiskCategoryMetrics } from '@/lib/types/analytics.types';
import { cn } from '@/lib/utils';

interface RiskHeatmapProps {
  className?: string;
  filters?: {
    time_period?: string;
    partner_ids?: string[];
    scheme_ids?: string[];
    assessment_statuses?: string[];
  };
}

interface RiskCategoryDisplay {
  key: keyof RiskCategoryMetrics;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const RISK_CATEGORIES: RiskCategoryDisplay[] = [
  {
    key: 'financial_risk',
    label: 'Financial Risk',
    shortLabel: 'Financial',
    icon: TrendingDown,
    description: 'Assessment of financial stability, cash flow, and debt levels'
  },
  {
    key: 'operational_risk',
    label: 'Operational Risk',
    shortLabel: 'Operational',
    icon: Shield,
    description: 'Evaluation of operational processes, efficiency, and execution capability'
  },
  {
    key: 'market_risk',
    label: 'Market Risk',
    shortLabel: 'Market',
    icon: TrendingUp,
    description: 'Analysis of market conditions, demand, and competitive positioning'
  },
  {
    key: 'regulatory_risk',
    label: 'Regulatory Risk',
    shortLabel: 'Regulatory',
    icon: AlertTriangle,
    description: 'Compliance with regulations, legal requirements, and policy changes'
  },
  {
    key: 'reputational_risk',
    label: 'Reputational Risk',
    shortLabel: 'Reputation',
    icon: Shield,
    description: 'Brand reputation, stakeholder perception, and public relations'
  },
  {
    key: 'compliance_risk',
    label: 'Compliance Risk',
    shortLabel: 'Compliance',
    icon: AlertTriangle,
    description: 'Adherence to internal policies, external standards, and best practices'
  },
  {
    key: 'strategic_risk',
    label: 'Strategic Risk',
    shortLabel: 'Strategic',
    icon: TrendingUp,
    description: 'Alignment with business strategy, long-term planning, and goal achievement'
  }
];

const RISK_LEVELS = [
  { min: 0, max: 2, label: 'Very Low', color: '#BED600', bgColor: 'bg-green-100' },
  { min: 2, max: 4, label: 'Low', color: '#90EE90', bgColor: 'bg-green-50' },
  { min: 4, max: 6, label: 'Medium', color: '#FFD700', bgColor: 'bg-yellow-100' },
  { min: 6, max: 8, label: 'High', color: '#FF8C00', bgColor: 'bg-orange-100' },
  { min: 8, max: 10, label: 'Very High', color: '#FF4500', bgColor: 'bg-red-100' }
];

export function RiskHeatmap({ className, filters }: RiskHeatmapProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showDetails, setShowDetails] = useState(false);
  const [sortBy, setSortBy] = useState<'avg_score' | 'max_score' | 'assessments'>('avg_score');

  const { 
    data: riskData, 
    isLoading, 
    error 
  } = useRiskAnalytics(filters);

  // Process risk data for heatmap
  const processedData = useMemo(() => {
    if (!riskData?.data?.risk_categories) return [];

    return RISK_CATEGORIES.map(category => {
      const metrics = riskData.data.risk_categories[category.key];
      const riskLevel = RISK_LEVELS.find(level => 
        metrics.avg_score >= level.min && metrics.avg_score < level.max
      ) || RISK_LEVELS[RISK_LEVELS.length - 1];

      return {
        ...category,
        metrics,
        riskLevel,
        intensity: metrics.avg_score / 10 // Normalize to 0-1 for visual intensity
      };
    }).sort((a, b) => {
      switch (sortBy) {
        case 'avg_score':
          return b.metrics.avg_score - a.metrics.avg_score;
        case 'max_score':
          return b.metrics.max_score - a.metrics.max_score;
        case 'assessments':
          return b.metrics.assessments_with_score - a.metrics.assessments_with_score;
        default:
          return 0;
      }
    });
  }, [riskData?.data?.risk_categories, sortBy]);

  const overallRiskLevel = useMemo(() => {
    if (!riskData?.data?.avg_risk_score) return null;
    return RISK_LEVELS.find(level => 
      riskData.data.avg_risk_score >= level.min && riskData.data.avg_risk_score < level.max
    ) || RISK_LEVELS[RISK_LEVELS.length - 1];
  }, [riskData?.data?.avg_risk_score]);

  const getIntensityColor = (intensity: number) => {
    if (intensity < 0.2) return 'bg-green-100 text-green-800';
    if (intensity < 0.4) return 'bg-yellow-100 text-yellow-800';
    if (intensity < 0.6) return 'bg-orange-100 text-orange-800';
    if (intensity < 0.8) return 'bg-red-100 text-red-800';
    return 'bg-red-200 text-red-900';
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
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
            <Shield className="h-5 w-5" />
            Risk Assessment Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Failed to load risk assessment data. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const renderGridView = () => (
    <div className="space-y-4">
      {/* Overall Risk Summary */}
      <div className="flex items-center justify-between p-4 bg-[#F4F1E9] rounded-lg">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-[#215788]" />
          <div>
            <h3 className="font-semibold text-sm">Overall Risk Score</h3>
            <p className="text-xs text-muted-foreground">
              Based on {riskData?.data?.high_risk_assessments} assessments
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[#215788]">
            {riskData?.data?.avg_risk_score?.toFixed(1) || '0.0'}
          </div>
          {overallRiskLevel && (
            <Badge 
              variant="outline" 
              className={cn("text-xs", overallRiskLevel.bgColor)}
              style={{ color: overallRiskLevel.color }}
            >
              {overallRiskLevel.label}
            </Badge>
          )}
        </div>
      </div>

      {/* Risk Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {processedData.map((category) => {
          const IconComponent = category.icon;
          return (
            <TooltipProvider key={category.key}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className={cn(
                      "p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md",
                      getIntensityColor(category.intensity)
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <IconComponent className="h-4 w-4" />
                      <span className="text-lg font-bold">
                        {category.metrics.avg_score.toFixed(1)}
                      </span>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{category.shortLabel}</h4>
                    <div className="flex justify-between text-xs">
                      <span>Min: {category.metrics.min_score.toFixed(1)}</span>
                      <span>Max: {category.metrics.max_score.toFixed(1)}</span>
                    </div>
                    {showDetails && (
                      <div className="mt-2 pt-2 border-t border-current/20">
                        <p className="text-xs">
                          {category.metrics.assessments_with_score} assessments
                        </p>
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="max-w-xs">
                    <p className="font-medium">{category.label}</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {category.description}
                    </p>
                    <div className="space-y-1 text-xs">
                      <p>Average Score: {category.metrics.avg_score.toFixed(2)}</p>
                      <p>Range: {category.metrics.min_score.toFixed(1)} - {category.metrics.max_score.toFixed(1)}</p>
                      <p>Assessments: {category.metrics.assessments_with_score}</p>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );

  const renderListView = () => (
    <div className="space-y-3">
      {processedData.map((category, index) => {
        const IconComponent = category.icon;
        return (
          <div key={category.key} className="flex items-center justify-between p-4 bg-[#F4F1E9] rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <IconComponent className="h-4 w-4 text-[#215788]" />
                <span className="text-sm font-medium">{category.label}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                #{index + 1}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium">
                  Avg: {category.metrics.avg_score.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Range: {category.metrics.min_score.toFixed(1)} - {category.metrics.max_score.toFixed(1)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">
                  {category.metrics.assessments_with_score}
                </div>
                <div className="text-xs text-muted-foreground">
                  assessments
                </div>
              </div>
              <div 
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold",
                  getIntensityColor(category.intensity)
                )}
              >
                {category.metrics.avg_score.toFixed(1)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#215788]" />
            <CardTitle>Risk Assessment Heatmap</CardTitle>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Details</span>
              <Switch
                checked={showDetails}
                onCheckedChange={setShowDetails}
                size="sm"
              />
            </div>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="avg_score">Avg Score</SelectItem>
                <SelectItem value="max_score">Max Score</SelectItem>
                <SelectItem value="assessments">Assessments</SelectItem>
              </SelectContent>
            </Select>
            <Select value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'list')}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="list">List</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'grid' ? renderGridView() : renderListView()}
        
        {/* Risk Level Legend */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-medium text-sm mb-3">Risk Level Legend</h4>
          <div className="flex flex-wrap gap-2">
            {RISK_LEVELS.map((level) => (
              <div key={level.label} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: level.color }}
                />
                <span className="text-xs">
                  {level.label} ({level.min}-{level.max})
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}