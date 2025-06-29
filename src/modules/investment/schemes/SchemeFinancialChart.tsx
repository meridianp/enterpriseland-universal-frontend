'use client';

import { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PBSAScheme } from '@/lib/types/scheme.types';

interface SchemeFinancialChartProps {
  scheme: PBSAScheme;
}

const COLORS = {
  primary: '#215788',
  secondary: '#00B7B2',
  accent: '#E37222',
  success: '#BED600',
  muted: '#3C3C3B',
};

const formatCurrency = (value: number, currency?: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatCompactCurrency = (value: number) => {
  if (value >= 1000000) {
    return `£${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `£${(value / 1000).toFixed(0)}K`;
  }
  return `£${value}`;
};

export function SchemeFinancialChart({ scheme }: SchemeFinancialChartProps) {
  const costBreakdownData = useMemo(() => {
    if (!scheme.total_development_cost_amount || !scheme.total_beds) return [];
    
    const totalCost = scheme.total_development_cost_amount;
    const costPerBed = scheme.cost_per_bed || totalCost / scheme.total_beds;
    
    // Estimated breakdown (in real app, this would come from backend)
    return [
      { name: 'Construction', value: totalCost * 0.65, percentage: 65 },
      { name: 'Land', value: totalCost * 0.15, percentage: 15 },
      { name: 'Professional Fees', value: totalCost * 0.08, percentage: 8 },
      { name: 'Finance Costs', value: totalCost * 0.07, percentage: 7 },
      { name: 'Other', value: totalCost * 0.05, percentage: 5 },
    ];
  }, [scheme]);

  const comparisonData = useMemo(() => {
    if (!scheme.cost_per_bed) return [];
    
    const costPerBed = scheme.cost_per_bed;
    
    // In a real app, these would be market benchmarks from the backend
    return [
      { name: 'This Scheme', value: costPerBed, type: 'current' },
      { name: 'Market Average', value: costPerBed * 1.1, type: 'benchmark' },
      { name: 'Market Low', value: costPerBed * 0.8, type: 'benchmark' },
      { name: 'Market High', value: costPerBed * 1.3, type: 'benchmark' },
    ];
  }, [scheme]);

  const metricsData = useMemo(() => {
    const metrics = [];
    
    if (scheme.total_development_cost_amount) {
      metrics.push({
        name: 'Total Cost',
        value: scheme.total_development_cost_amount,
        formatted: formatCurrency(scheme.total_development_cost_amount, scheme.total_development_cost_currency),
      });
    }
    
    if (scheme.cost_per_bed) {
      metrics.push({
        name: 'Cost/Bed',
        value: scheme.cost_per_bed,
        formatted: formatCurrency(scheme.cost_per_bed, scheme.total_development_cost_currency),
      });
    }
    
    if (scheme.estimated_gcd_amount) {
      metrics.push({
        name: 'Est. GCD',
        value: scheme.estimated_gcd_amount,
        formatted: formatCurrency(scheme.estimated_gcd_amount, scheme.estimated_gcd_currency),
      });
    }
    
    return metrics;
  }, [scheme]);

  if (!scheme.total_development_cost_amount && !scheme.cost_per_bed && !scheme.estimated_gcd_amount) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">No financial data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="breakdown" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
        <TabsTrigger value="comparison">Market Comparison</TabsTrigger>
        <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
      </TabsList>

      {/* Cost Breakdown Tab */}
      <TabsContent value="breakdown">
        <Card>
          <CardHeader>
            <CardTitle>Development Cost Breakdown</CardTitle>
            <CardDescription>
              Estimated allocation of total development costs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {costBreakdownData.length > 0 ? (
              <div className="space-y-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={costBreakdownData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ percentage }) => `${percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {costBreakdownData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={Object.values(COLORS)[index % Object.values(COLORS).length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value, scheme.total_development_cost_currency)} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-2">
                  {costBreakdownData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: Object.values(COLORS)[index % Object.values(COLORS).length] }}
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">
                        {formatCurrency(item.value, scheme.total_development_cost_currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Cost breakdown data not available
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Market Comparison Tab */}
      <TabsContent value="comparison">
        <Card>
          <CardHeader>
            <CardTitle>Cost per Bed Comparison</CardTitle>
            <CardDescription>
              How this scheme compares to market benchmarks
            </CardDescription>
          </CardHeader>
          <CardContent>
            {comparisonData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatCompactCurrency} />
                  <Tooltip formatter={(value: number) => formatCurrency(value, scheme.total_development_cost_currency)} />
                  <Bar 
                    dataKey="value" 
                    fill={COLORS.primary}
                    radius={[4, 4, 0, 0]}
                  >
                    {comparisonData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.type === 'current' ? COLORS.primary : COLORS.secondary} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Comparison data not available
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Key Metrics Tab */}
      <TabsContent value="metrics">
        <Card>
          <CardHeader>
            <CardTitle>Financial Metrics Summary</CardTitle>
            <CardDescription>
              Key financial indicators for the scheme
            </CardDescription>
          </CardHeader>
          <CardContent>
            {metricsData.length > 0 ? (
              <div className="space-y-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metricsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={formatCompactCurrency} />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip formatter={(value: number) => formatCurrency(value, scheme.total_development_cost_currency)} />
                    <Bar 
                      dataKey="value" 
                      fill={COLORS.primary}
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {metricsData.map((metric) => (
                    <div key={metric.name} className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">{metric.name}</p>
                      <p className="text-xl font-bold mt-1">{metric.formatted}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Financial metrics not available
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}