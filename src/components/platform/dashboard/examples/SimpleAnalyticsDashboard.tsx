'use client';

import { 
  GeographicDistributionChart,
  RiskHeatmap,
  InvestmentPipelineChart,
  PerformanceMetricsGrid,
  ActivityTimelineWidget,
  ComplianceStatusWidget
} from '@/components/dashboard';
import { TimePeriod } from '@/lib/types/analytics.types';

/**
 * Simple Analytics Dashboard Example
 * 
 * This example demonstrates how to use individual analytics widgets
 * in a custom dashboard layout. Each component can be used independently
 * and customized according to specific requirements.
 */
export function SimpleAnalyticsDashboard() {
  const commonFilters = {
    time_period: TimePeriod.LAST_30_DAYS,
    include_archived: false,
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-[#215788]">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time insights and performance metrics
        </p>
      </div>

      {/* Performance Overview - Full Width */}
      <PerformanceMetricsGrid 
        filters={commonFilters}
        className="w-full"
      />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Distribution */}
        <GeographicDistributionChart 
          filters={commonFilters}
          className="h-96"
        />
        
        {/* Investment Pipeline */}
        <InvestmentPipelineChart 
          filters={commonFilters}
          className="h-96"
        />
      </div>

      {/* Risk Analysis - Full Width */}
      <RiskHeatmap 
        filters={commonFilters}
        className="w-full"
      />

      {/* Activity and Compliance */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Activity Timeline - Takes 2 columns */}
        <div className="xl:col-span-2">
          <ActivityTimelineWidget 
            filters={commonFilters}
            maxItems={20}
            className="h-96"
          />
        </div>
        
        {/* Compliance Status */}
        <ComplianceStatusWidget 
          filters={commonFilters}
          className="h-96"
        />
      </div>
    </div>
  );
}

/**
 * Minimal Dashboard Example
 * 
 * A more focused dashboard showing just key metrics
 */
export function MinimalDashboard() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-[#215788]">Key Metrics</h1>
      
      {/* Just the essentials */}
      <PerformanceMetricsGrid />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InvestmentPipelineChart className="h-64" />
        <ComplianceStatusWidget className="h-64" />
      </div>
    </div>
  );
}

/**
 * Risk-Focused Dashboard Example
 * 
 * Dashboard focused specifically on risk analysis
 */
export function RiskDashboard() {
  const riskFilters = {
    time_period: TimePeriod.LAST_90_DAYS,
    risk_levels: ['HIGH', 'MEDIUM'] as any[],
  };

  return (
    <div className="space-y-6 p-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-red-600">Risk Analysis Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive risk assessment and monitoring
        </p>
      </div>

      {/* Risk-specific layout */}
      <RiskHeatmap 
        filters={riskFilters}
        className="w-full"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComplianceStatusWidget 
          filters={riskFilters}
          className="h-96"
        />
        
        <PerformanceMetricsGrid 
          filters={riskFilters}
          className="h-96"
        />
      </div>
    </div>
  );
}

/**
 * Geographic Focus Dashboard Example
 * 
 * Dashboard emphasizing geographic and location-based analytics
 */
export function GeographicDashboard() {
  const geoFilters = {
    time_period: TimePeriod.LAST_12_MONTHS,
    countries: ['GB', 'US', 'CA', 'AU'],
  };

  return (
    <div className="space-y-6 p-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-[#00B7B2]">Geographic Analytics</h1>
        <p className="text-muted-foreground">
          Regional performance and distribution insights
        </p>
      </div>

      {/* Geographic-focused layout */}
      <GeographicDistributionChart 
        filters={geoFilters}
        className="w-full h-96"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InvestmentPipelineChart 
          filters={geoFilters}
          className="h-80"
        />
        
        <ActivityTimelineWidget 
          filters={geoFilters}
          maxItems={15}
          className="h-80"
        />
      </div>
    </div>
  );
}