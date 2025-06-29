'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  FunnelChart, 
  Funnel, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Building2, TrendingUp, DollarSign, Users, MapPin } from 'lucide-react';
import { useSchemeAnalytics } from '@/lib/hooks/useAnalyticsQueries';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DevelopmentStage, DevelopmentStageBreakdown, Currency } from '@/lib/types/analytics.types';

interface InvestmentPipelineChartProps {
  className?: string;
  filters?: {
    time_period?: string;
    currencies?: Currency[];
    partner_ids?: string[];
  };
}

// Brand colors for different stages
const STAGE_COLORS = {
  [DevelopmentStage.PLANNING]: '#215788', // Deep Blue
  [DevelopmentStage.APPROVED]: '#00B7B2', // Turquoise
  [DevelopmentStage.UNDER_CONSTRUCTION]: '#BED600', // Green
  [DevelopmentStage.COMPLETED]: '#E37222', // Orange
  [DevelopmentStage.ON_HOLD]: '#3C3C3B', // Charcoal
};

const STAGE_LABELS = {
  [DevelopmentStage.PLANNING]: 'Planning',
  [DevelopmentStage.APPROVED]: 'Approved',
  [DevelopmentStage.UNDER_CONSTRUCTION]: 'Under Construction',
  [DevelopmentStage.COMPLETED]: 'Completed',
  [DevelopmentStage.ON_HOLD]: 'On Hold',
};

// Currency formatting
const formatCurrency = (amount: number, currency: Currency = Currency.GBP): string => {
  const symbols = {
    [Currency.GBP]: '£',
    [Currency.USD]: '$',
    [Currency.EUR]: '€',
  };

  if (amount >= 1000000) {
    return `${symbols[currency]}${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `${symbols[currency]}${(amount / 1000).toFixed(1)}K`;
  }
  return `${symbols[currency]}${amount.toLocaleString()}`;
};

export function InvestmentPipelineChart({ 
  className,
  filters 
}: InvestmentPipelineChartProps) {
  const [viewType, setViewType] = useState<'beds' | 'schemes' | 'investment'>('beds');
  const [chartType, setChartType] = useState<'bar' | 'funnel' | 'pie'>('bar');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(Currency.GBP);

  const { 
    data: schemeData, 
    isLoading, 
    error 
  } = useSchemeAnalytics(filters);

  // Process data for different visualizations
  const chartData = useMemo(() => {
    if (!schemeData?.data) return [];

    const stageBreakdown = schemeData.data.development_stage_breakdown || [];
    const investmentByCurrency = schemeData.data.investment_by_currency || [];
    const bedsPipeline = schemeData.data.beds_pipeline || {};

    return stageBreakdown.map(stage => {
      // Find investment data for selected currency
      const currencyInvestment = investmentByCurrency.find(
        inv => inv.currency === selectedCurrency
      );
      const totalInvestment = currencyInvestment?.total_amount || 0;
      
      // Estimate investment per stage based on percentage
      const stageInvestment = (totalInvestment * stage.percentage) / 100;

      return {
        stage: STAGE_LABELS[stage.stage] || stage.stage,
        stageKey: stage.stage,
        schemes: stage.count,
        beds: stage.total_beds,
        investment: stageInvestment,
        percentage: stage.percentage,
        color: STAGE_COLORS[stage.stage] || '#3C3C3B'
      };
    }).sort((a, b) => {
      // Sort by development stage order
      const order = [
        DevelopmentStage.PLANNING,
        DevelopmentStage.APPROVED,
        DevelopmentStage.UNDER_CONSTRUCTION,
        DevelopmentStage.COMPLETED,
        DevelopmentStage.ON_HOLD
      ];
      return order.indexOf(a.stageKey) - order.indexOf(b.stageKey);
    });
  }, [schemeData?.data, selectedCurrency]);

  const totalMetrics = useMemo(() => {
    return chartData.reduce((acc, stage) => ({
      schemes: acc.schemes + stage.schemes,
      beds: acc.beds + stage.beds,
      investment: acc.investment + stage.investment
    }), { schemes: 0, beds: 0, investment: 0 });
  }, [chartData]);

  const availableCurrencies = useMemo(() => {
    return schemeData?.data?.investment_by_currency?.map(inv => inv.currency) || [Currency.GBP];
  }, [schemeData?.data?.investment_by_currency]);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
            <Skeleton className="h-64 w-full" />
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
            <Building2 className="h-5 w-5" />
            Investment Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Failed to load investment pipeline data. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const renderBarChart = () => {
    const dataKey = viewType === 'beds' ? 'beds' : viewType === 'schemes' ? 'schemes' : 'investment';
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="stage" 
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
            tickFormatter={(value) => viewType === 'investment' ? formatCurrency(value, selectedCurrency) : value.toLocaleString()}
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-background border rounded-lg p-3 shadow-lg">
                    <p className="font-medium text-sm">{label}</p>
                    <p className="text-sm text-muted-foreground">
                      Schemes: {data.schemes}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Beds: {data.beds.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Investment: {formatCurrency(data.investment, selectedCurrency)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Share: {data.percentage.toFixed(1)}%
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey={dataKey} 
            fill="#215788"
            radius={[4, 4, 0, 0]}
          />
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderFunnelChart = () => {
    const funnelData = chartData.map(stage => ({
      ...stage,
      value: viewType === 'beds' ? stage.beds : viewType === 'schemes' ? stage.schemes : stage.investment,
      name: stage.stage
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <FunnelChart>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-background border rounded-lg p-3 shadow-lg">
                    <p className="font-medium text-sm">{data.stage}</p>
                    <p className="text-sm text-muted-foreground">
                      Schemes: {data.schemes}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Beds: {data.beds.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Investment: {formatCurrency(data.investment, selectedCurrency)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Funnel
            dataKey="value"
            data={funnelData}
            isAnimationActive
          >
            {funnelData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    );
  };

  const renderPieChart = () => {
    const dataKey = viewType === 'beds' ? 'beds' : viewType === 'schemes' ? 'schemes' : 'investment';
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={2}
            dataKey={dataKey}
            label={({ stage, percentage }) => `${stage}: ${percentage.toFixed(1)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-background border rounded-lg p-3 shadow-lg">
                    <p className="font-medium text-sm">{data.stage}</p>
                    <p className="text-sm text-muted-foreground">
                      Value: {viewType === 'investment' ? formatCurrency(data.investment, selectedCurrency) : data[dataKey].toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Share: {data.percentage.toFixed(1)}%
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#215788]" />
            <CardTitle>Investment Pipeline</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Select value={viewType} onValueChange={(v) => setViewType(v as 'beds' | 'schemes' | 'investment')}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beds">Beds</SelectItem>
                <SelectItem value="schemes">Schemes</SelectItem>
                <SelectItem value="investment">Investment</SelectItem>
              </SelectContent>
            </Select>
            {viewType === 'investment' && (
              <Select value={selectedCurrency} onValueChange={(v) => setSelectedCurrency(v as Currency)}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableCurrencies.map(currency => (
                    <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={chartType} onValueChange={(v) => setChartType(v as 'bar' | 'funnel' | 'pie')}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar</SelectItem>
                <SelectItem value="funnel">Funnel</SelectItem>
                <SelectItem value="pie">Pie</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chart">Chart View</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#215788]">
                  {totalMetrics.schemes}
                </div>
                <div className="text-sm text-muted-foreground">Total Schemes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00B7B2]">
                  {totalMetrics.beds.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Beds</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#BED600]">
                  {formatCurrency(totalMetrics.investment, selectedCurrency)}
                </div>
                <div className="text-sm text-muted-foreground">Total Investment</div>
              </div>
            </div>
            
            <div className="w-full">
              {chartType === 'bar' && renderBarChart()}
              {chartType === 'funnel' && renderFunnelChart()}
              {chartType === 'pie' && renderPieChart()}
            </div>
          </TabsContent>
          
          <TabsContent value="summary" className="space-y-4">
            <div className="space-y-3">
              {chartData.map((stage, index) => (
                <div key={stage.stageKey} className="flex items-center justify-between p-4 bg-[#F4F1E9] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <div>
                      <p className="font-medium text-sm">{stage.stage}</p>
                      <p className="text-xs text-muted-foreground">
                        {stage.percentage.toFixed(1)}% of total
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="font-medium text-sm">{stage.schemes}</div>
                      <div className="text-xs text-muted-foreground">schemes</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-sm">{stage.beds.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">beds</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-sm">
                        {formatCurrency(stage.investment, selectedCurrency)}
                      </div>
                      <div className="text-xs text-muted-foreground">investment</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Stage Progress Indicators */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Development Progress
          </h4>
          <div className="flex items-center gap-1">
            {chartData.map((stage, index) => (
              <div key={stage.stageKey} className="flex-1">
                <div 
                  className="h-2 rounded-full"
                  style={{ 
                    backgroundColor: stage.color,
                    opacity: 0.3 + (stage.percentage / 100) * 0.7
                  }}
                />
                <div className="text-xs text-center mt-1 text-muted-foreground">
                  {stage.stage.split(' ')[0]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}