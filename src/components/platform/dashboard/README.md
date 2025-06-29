# Advanced Dashboard Analytics Components

This directory contains sophisticated analytics widgets for the EnterpriseLand Due-Diligence Platform dashboard. These components provide comprehensive data visualization and insights for investment assessment and partner management.

## Components Overview

### 1. GeographicDistributionChart.tsx
Interactive visualization showing partner and scheme distribution by country/region.

**Features:**
- Bar chart and pie chart views
- Partner vs. scheme data toggle
- Interactive tooltips with detailed information
- Top countries summary
- Sorting by count or percentage
- Responsive design with list view option

**Usage:**
```tsx
import { GeographicDistributionChart } from '@/components/dashboard';

<GeographicDistributionChart 
  filters={{ time_period: 'last_30_days' }}
  className="h-96"
/>
```

### 2. RiskHeatmap.tsx
Visual heatmap displaying risk assessment scores across different categories.

**Features:**
- Color-coded risk level visualization
- Seven risk categories: Financial, Operational, Market, Regulatory, Reputational, Compliance, Strategic
- Grid and list view modes
- Interactive tooltips with risk details
- Risk level legend and sorting options
- Overall risk score summary

**Usage:**
```tsx
import { RiskHeatmap } from '@/components/dashboard';

<RiskHeatmap 
  filters={{ assessment_statuses: ['COMPLETED'] }}
  className="h-96"
/>
```

### 3. InvestmentPipelineChart.tsx
Chart showing investment pipeline by development stage with multiple visualization options.

**Features:**
- Bar, funnel, and pie chart views
- Beds, schemes, and investment value data
- Multi-currency support
- Development stage progress indicators
- Stage-by-stage breakdown
- Currency-aware formatting

**Usage:**
```tsx
import { InvestmentPipelineChart } from '@/components/dashboard';

<InvestmentPipelineChart 
  filters={{ currencies: ['GBP', 'USD'] }}
  className="h-96"
/>
```

### 4. PerformanceMetricsGrid.tsx
Grid of KPI cards showing comprehensive performance metrics and benchmarks.

**Features:**
- Six key performance indicators
- Trend analysis with directional indicators
- Progress bars and benchmark comparisons
- Performance alerts summary
- Real-time metric updates
- Color-coded status indicators

**Usage:**
```tsx
import { PerformanceMetricsGrid } from '@/components/dashboard';

<PerformanceMetricsGrid 
  filters={{ time_period: 'last_90_days' }}
  className="h-96"
/>
```

### 5. ActivityTimelineWidget.tsx
Real-time timeline showing recent activities across all platform areas.

**Features:**
- Real-time activity updates
- Activity type filtering
- Time-based filtering (1h, 24h, 7d, 30d)
- Auto-refresh capability
- Grouped by date organization
- User action tracking

**Usage:**
```tsx
import { ActivityTimelineWidget } from '@/components/dashboard';

<ActivityTimelineWidget 
  maxItems={50}
  filters={{ time_period: 'last_7_days' }}
  className="h-96"
/>
```

### 6. ComplianceStatusWidget.tsx
Dashboard widget showing compliance status across partners and schemes.

**Features:**
- Red/yellow/green status indicators
- Compliance score tracking
- Critical issue alerts
- Detailed compliance breakdown
- Trend analysis
- Filterable compliance items

**Usage:**
```tsx
import { ComplianceStatusWidget } from '@/components/dashboard';

<ComplianceStatusWidget 
  filters={{ partner_ids: ['partner-1', 'partner-2'] }}
  className="h-96"
/>
```

### 7. AdvancedAnalyticsDashboard.tsx
Comprehensive dashboard component showcasing all analytics widgets in a cohesive layout.

**Features:**
- Tabbed organization (Overview, Geographic, Risk Analysis, Activity)
- Global filtering and refresh capabilities
- Export functionality
- Responsive grid layouts
- Usage guide and quick statistics

**Usage:**
```tsx
import { AdvancedAnalyticsDashboard } from '@/components/dashboard';

export default function DashboardPage() {
  return (
    <div className="p-6">
      <AdvancedAnalyticsDashboard />
    </div>
  );
}
```

## Data Requirements

All components use the analytics hooks from `@/lib/hooks/useAnalyticsQueries`:

- `usePartnerAnalytics()` - Partner metrics and geographic distribution
- `useSchemeAnalytics()` - Scheme pipeline and development stages
- `useRiskAnalytics()` - Risk assessment data and category breakdowns
- `usePerformanceMetrics()` - KPI data and benchmarks
- `useDashboardOverview()` - Recent activity and platform metrics

## Styling and Theming

Components follow the EnterpriseLand brand guidelines:

**Brand Colors:**
- Deep Blue (#215788) - Headers, primary actions
- Turquoise (#00B7B2) - Links, secondary actions
- Charcoal (#3C3C3B) - Text
- Sand (#F4F1E9) - Card backgrounds
- Green (#BED600) - Success states
- Orange (#E37222) - Warnings

**Component Structure:**
- Uses shadcn/ui components for consistency
- Responsive design with mobile-first approach
- Accessible with proper ARIA labels
- Loading states and error handling
- TypeScript for type safety

## Common Props

Most components accept these common props:

```tsx
interface CommonProps {
  className?: string;           // Additional CSS classes
  filters?: AnalyticsFilters;   // Data filtering options
}
```

### AnalyticsFilters Interface:
```tsx
interface AnalyticsFilters {
  time_period?: TimePeriod;
  start_date?: string;
  end_date?: string;
  partner_ids?: string[];
  scheme_ids?: string[];
  assessment_statuses?: AssessmentStatus[];
  risk_levels?: RiskLevel[];
  currencies?: Currency[];
  countries?: string[];
  include_archived?: boolean;
}
```

## Dependencies

Required packages (already included in package.json):
- `recharts` - Chart visualization library
- `lucide-react` - Icon library
- `date-fns` - Date formatting utilities
- `@tanstack/react-query` - Data fetching and caching
- `@radix-ui/*` - Accessible UI primitives

## Best Practices

1. **Performance**: Components use React Query for efficient data caching and background updates
2. **Accessibility**: All interactive elements have proper ARIA labels and keyboard navigation
3. **Responsiveness**: Layouts adapt to different screen sizes using CSS Grid and Flexbox
4. **Error Handling**: Components gracefully handle loading states and API errors
5. **Type Safety**: Full TypeScript coverage with proper type definitions

## Testing

Each component includes:
- Unit tests for component rendering
- Integration tests for data handling
- Visual regression tests for UI consistency
- Accessibility tests for WCAG compliance

Run tests:
```bash
npm run test                    # Unit tests
npm run test:coverage          # Coverage report
npm run test:e2e              # End-to-end tests
```

## Customization

Components can be customized through:
- CSS classes via `className` prop
- Theme variables in Tailwind config
- Custom filter configurations
- Chart color schemes
- Layout grid modifications

Example customization:
```tsx
<GeographicDistributionChart 
  className="bg-white border-2 border-blue-200"
  filters={{
    time_period: TimePeriod.LAST_6_MONTHS,
    countries: ['GB', 'US', 'CA']
  }}
/>
```