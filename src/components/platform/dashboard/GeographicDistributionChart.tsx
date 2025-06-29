'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Globe, Building2, Users, MapPin } from 'lucide-react';
import { usePartnerAnalytics, useSchemeAnalytics } from '@/lib/hooks/useAnalyticsQueries';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GeographicDistribution } from '@/lib/types/analytics.types';

interface GeographicDistributionChartProps {
  className?: string;
  filters?: {
    time_period?: string;
    partner_ids?: string[];
    scheme_ids?: string[];
  };
}

// Brand colors for the chart
const CHART_COLORS = [
  '#215788', // Deep Blue
  '#00B7B2', // Turquoise
  '#BED600', // Green
  '#E37222', // Orange
  '#3C3C3B', // Charcoal
  '#8B5CF6', // Purple
  '#EF4444', // Red
  '#F59E0B', // Amber
];

export function GeographicDistributionChart({ 
  className,
  filters 
}: GeographicDistributionChartProps) {
  const [viewType, setViewType] = useState<'partners' | 'schemes'>('partners');
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const [sortBy, setSortBy] = useState<'count' | 'percentage'>('count');

  const { 
    data: partnerData, 
    isLoading: partnersLoading, 
    error: partnersError 
  } = usePartnerAnalytics(filters);

  const { 
    data: schemeData, 
    isLoading: schemesLoading, 
    error: schemesError 
  } = useSchemeAnalytics(filters);

  const isLoading = partnersLoading || schemesLoading;
  const error = partnersError || schemesError;

  // Process data for visualization
  const chartData = useMemo(() => {
    if (!partnerData?.data && !schemeData?.data) return [];

    const geographic = viewType === 'partners' 
      ? partnerData?.data?.geographic_distribution || []
      : schemeData?.data?.geographic_distribution || [];

    // Sort data based on selected criteria
    const sortedData = [...geographic].sort((a, b) => {
      if (sortBy === 'count') {
        return b.count - a.count;
      }
      return b.percentage - a.percentage;
    });

    // Limit to top 10 for better visualization
    return sortedData.slice(0, 10).map((item, index) => ({
      ...item,
      color: CHART_COLORS[index % CHART_COLORS.length]
    }));
  }, [partnerData?.data, schemeData?.data, viewType, sortBy]);

  const totalCount = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.count, 0);
  }, [chartData]);

  const topCountries = useMemo(() => {
    return chartData.slice(0, 5);
  }, [chartData]);

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
            <Globe className="h-5 w-5" />
            Geographic Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Failed to load geographic distribution data. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="country" 
          tick={{ fontSize: 12 }}
          className="text-muted-foreground"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          className="text-muted-foreground"
        />
        <Tooltip 
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload as GeographicDistribution & { color: string };
              return (
                <div className="bg-background border rounded-lg p-3 shadow-lg">
                  <p className="font-medium text-sm">{label}</p>
                  <p className="text-sm text-muted-foreground">
                    {viewType === 'partners' ? 'Partners' : 'Schemes'}: {data.count}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Percentage: {data.percentage.toFixed(1)}%
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar 
          dataKey="count" 
          fill="#215788"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={120}
          paddingAngle={2}
          dataKey="count"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload as GeographicDistribution & { color: string };
              return (
                <div className="bg-background border rounded-lg p-3 shadow-lg">
                  <p className="font-medium text-sm">{data.country}</p>
                  <p className="text-sm text-muted-foreground">
                    {viewType === 'partners' ? 'Partners' : 'Schemes'}: {data.count}
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

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-[#215788]" />
            <CardTitle>Geographic Distribution</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Select value={viewType} onValueChange={(v) => setViewType(v as 'partners' | 'schemes')}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="partners">Partners</SelectItem>
                <SelectItem value="schemes">Schemes</SelectItem>
              </SelectContent>
            </Select>
            <Select value={chartType} onValueChange={(v) => setChartType(v as 'bar' | 'pie')}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar</SelectItem>
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
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Total: {totalCount} {viewType}
              </Badge>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'count' | 'percentage')}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="count">By Count</SelectItem>
                  <SelectItem value="percentage">By Share</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full">
              {chartType === 'bar' ? renderBarChart() : renderPieChart()}
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="space-y-4">
            <div className="space-y-2">
              {chartData.map((country, index) => (
                <div 
                  key={country.country}
                  className="flex items-center justify-between p-3 bg-[#F4F1E9] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: country.color }}
                    />
                    <div>
                      <p className="font-medium text-sm">{country.country}</p>
                      <p className="text-xs text-muted-foreground">
                        #{index + 1} by {sortBy}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{country.count}</p>
                    <p className="text-xs text-muted-foreground">
                      {country.percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Top Countries Summary */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            {viewType === 'partners' ? <Users className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
            Top 5 Countries
          </h4>
          <div className="grid grid-cols-5 gap-2">
            {topCountries.map((country, index) => (
              <div key={country.country} className="text-center">
                <div className="text-lg font-bold text-[#215788]">
                  {country.count}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {country.country}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}