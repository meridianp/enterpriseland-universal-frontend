'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, BarChart3, Calendar, Download } from 'lucide-react';
import { 
  GeographicDistributionChart,
  RiskHeatmap,
  InvestmentPipelineChart,
  PerformanceMetricsGrid,
  ActivityTimelineWidget,
  ComplianceStatusWidget
} from '@/components/dashboard';
import { TimePeriod, AnalyticsFilters } from '@/lib/types/analytics.types';

interface AdvancedAnalyticsDashboardProps {
  className?: string;
}

/**
 * Advanced Analytics Dashboard
 * 
 * A comprehensive dashboard component that showcases all advanced analytics widgets
 * for the EnterpriseLand Due-Diligence Platform. This component demonstrates
 * how to integrate and use the sophisticated data visualization components.
 * 
 * Features:
 * - Interactive filtering across all widgets
 * - Real-time data refresh capabilities
 * - Responsive layout for different screen sizes
 * - Export functionality for reports
 * - Tabbed organization for better UX
 * 
 * Usage:
 * ```tsx
 * import { AdvancedAnalyticsDashboard } from '@/components/dashboard';
 * 
 * export default function DashboardPage() {
 *   return (
 *     <div className="p-6">
 *       <AdvancedAnalyticsDashboard />
 *     </div>
 *   );
 * }
 * ```
 */
export function AdvancedAnalyticsDashboard({ className }: AdvancedAnalyticsDashboardProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(TimePeriod.LAST_30_DAYS);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');

  // Construct filters based on current selections
  const filters: AnalyticsFilters = {
    time_period: timePeriod,
    include_archived: false,
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // In a real app, this would trigger a refetch of all data
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleExport = () => {
    // In a real app, this would trigger an export of dashboard data
    console.log('Exporting dashboard data...');
  };

  return (
    <div className={className}>
      {/* Dashboard Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#215788]">Advanced Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive insights and performance metrics for due-diligence operations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              Live Data
            </Badge>
            <Select value={timePeriod} onValueChange={(v) => setTimePeriod(v as TimePeriod)}>
              <SelectTrigger className="w-40">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TimePeriod.LAST_7_DAYS}>Last 7 Days</SelectItem>
                <SelectItem value={TimePeriod.LAST_30_DAYS}>Last 30 Days</SelectItem>
                <SelectItem value={TimePeriod.LAST_90_DAYS}>Last 90 Days</SelectItem>
                <SelectItem value={TimePeriod.LAST_6_MONTHS}>Last 6 Months</SelectItem>
                <SelectItem value={TimePeriod.LAST_12_MONTHS}>Last 12 Months</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={handleRefresh} 
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={handleExport}
              className="flex items-center gap-2 bg-[#215788] hover:bg-[#1a4567]"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics - Full Width */}
            <div className="lg:col-span-2">
              <PerformanceMetricsGrid filters={filters} />
            </div>
            
            {/* Investment Pipeline */}
            <InvestmentPipelineChart filters={filters} />
            
            {/* Compliance Status */}
            <ComplianceStatusWidget filters={filters} />
          </div>
        </TabsContent>

        {/* Geographic Tab */}
        <TabsContent value="geographic" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Geographic Distribution - Takes 2 columns */}
            <div className="xl:col-span-2">
              <GeographicDistributionChart filters={filters} />
            </div>
            
            {/* Investment Pipeline - 1 column */}
            <InvestmentPipelineChart filters={filters} />
          </div>
          
          {/* Performance Metrics */}
          <PerformanceMetricsGrid filters={filters} />
        </TabsContent>

        {/* Risk Analysis Tab */}
        <TabsContent value="risk" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Risk Heatmap - Takes 2 columns */}
            <div className="xl:col-span-2">
              <RiskHeatmap filters={filters} />
            </div>
            
            {/* Compliance Status */}
            <ComplianceStatusWidget filters={filters} />
          </div>
          
          {/* Performance Metrics focused on risk */}
          <PerformanceMetricsGrid filters={filters} />
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Activity Timeline - Takes 2 columns */}
            <div className="xl:col-span-2">
              <ActivityTimelineWidget filters={filters} maxItems={50} />
            </div>
            
            {/* Compliance Status */}
            <ComplianceStatusWidget filters={filters} />
          </div>
          
          {/* Additional widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GeographicDistributionChart filters={filters} />
            <InvestmentPipelineChart filters={filters} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Stats Footer */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Quick Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[#215788]">6</div>
              <div className="text-sm text-muted-foreground">Active Widgets</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#00B7B2]">{timePeriod.replace('_', ' ')}</div>
              <div className="text-sm text-muted-foreground">Time Period</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#BED600]">Real-time</div>
              <div className="text-sm text-muted-foreground">Data Updates</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#E37222]">Advanced</div>
              <div className="text-sm text-muted-foreground">Analytics</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card className="mt-6 bg-[#F4F1E9]">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Dashboard Usage Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Navigation</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Use tabs to explore different analytical views</li>
                <li>• Adjust time period using the dropdown filter</li>
                <li>• Click refresh to update all widgets with latest data</li>
                <li>• Export button generates comprehensive reports</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Widget Features</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Interactive charts with hover tooltips</li>
                <li>• Filterable data views and sorting options</li>
                <li>• Real-time activity timeline updates</li>
                <li>• Compliance alerts and status indicators</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}