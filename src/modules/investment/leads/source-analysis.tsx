'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LeadAnalytics } from '@/lib/types/leads.types';

interface SourceAnalysisProps {
  analytics: LeadAnalytics;
}

const SOURCE_COLORS = {
  MARKET_INTELLIGENCE: '#215788',
  REFERRAL: '#00B7B2',
  WEBSITE: '#BED600',
  EVENT: '#E37222',
  COLD_OUTREACH: '#9333EA',
  PARTNER: '#EC4899',
  OTHER: '#6B7280',
};

export function SourceAnalysis({ analytics }: SourceAnalysisProps) {
  const sourceData = Object.entries(analytics.pipeline.by_source).map(([source, count]) => ({
    name: source.replace(/_/g, ' '),
    source,
    count,
    value: analytics.pipeline.value_by_status[source as keyof typeof analytics.pipeline.value_by_status] || 0,
  }));

  const priorityData = Object.entries(analytics.pipeline.by_priority).map(([priority, count]) => ({
    name: priority,
    count,
  }));

  const statusData = Object.entries(analytics.pipeline.by_status).map(([status, count]) => ({
    name: status.replace(/_/g, ' '),
    count,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm">
              {entry.name}: {entry.value}
              {entry.dataKey === 'value' && ` ($${(entry.value / 1000).toFixed(0)}k)`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Lead Source Analysis</CardTitle>
          <CardDescription>
            Performance breakdown by lead acquisition channel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="count">
            <TabsList>
              <TabsTrigger value="count">By Count</TabsTrigger>
              <TabsTrigger value="value">By Value</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
            </TabsList>

            <TabsContent value="count">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sourceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="name" 
                    className="text-xs"
                    tick={{ fill: '#888' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: '#888' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="count" 
                    fill="#215788"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="value">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sourceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="name" 
                    className="text-xs"
                    tick={{ fill: '#888' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: '#888' }}
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="value" 
                    fill="#00B7B2"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="distribution">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-4">By Source</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={sourceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {sourceData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={SOURCE_COLORS[entry.source as keyof typeof SOURCE_COLORS] || '#6B7280'} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1 mt-4">
                    {sourceData.map((source) => (
                      <div key={source.source} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: SOURCE_COLORS[source.source as keyof typeof SOURCE_COLORS] || '#6B7280' }}
                          />
                          <span>{source.name}</span>
                        </div>
                        <span className="text-muted-foreground">{source.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-4">By Priority</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={priorityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {priorityData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={['#EF4444', '#F97316', '#EAB308', '#22C55E'][index % 4]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1 mt-4">
                    {priorityData.map((priority, index) => (
                      <div key={priority.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: ['#EF4444', '#F97316', '#EAB308', '#22C55E'][index % 4] }}
                          />
                          <span>{priority.name}</span>
                        </div>
                        <span className="text-muted-foreground">{priority.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* ROI Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Source ROI Analysis</CardTitle>
          <CardDescription>
            Cost effectiveness and return on investment by source
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sourceData.map((source) => {
              const conversionRate = Math.random() * 30 + 10; // Mock data
              const avgDealSize = source.value / (source.count || 1);
              const roi = Math.random() * 500 + 100; // Mock data

              return (
                <div key={source.source} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{source.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {source.count} leads • ${(avgDealSize / 1000).toFixed(0)}k avg
                    </p>
                  </div>
                  <div className="flex gap-6 text-right">
                    <div>
                      <p className="text-sm text-muted-foreground">Conversion</p>
                      <p className="font-medium">{conversionRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ROI</p>
                      <p className="font-medium text-green-600">+{roi.toFixed(0)}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}