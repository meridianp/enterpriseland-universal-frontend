import { useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { formatNumber } from '@/lib/utils';

interface TargetMapProps {
  data: Record<string, number>;
}

const countryNames: Record<string, string> = {
  GB: 'United Kingdom',
  US: 'United States',
  DE: 'Germany',
  FR: 'France',
  ES: 'Spain',
  IT: 'Italy',
  NL: 'Netherlands',
  BE: 'Belgium',
  CH: 'Switzerland',
  AT: 'Austria',
  SE: 'Sweden',
  DK: 'Denmark',
  NO: 'Norway',
  FI: 'Finland',
  IE: 'Ireland',
  PT: 'Portugal',
  PL: 'Poland',
  CZ: 'Czech Republic',
  HU: 'Hungary',
  RO: 'Romania',
  CA: 'Canada',
  AU: 'Australia',
  NZ: 'New Zealand',
  JP: 'Japan',
  CN: 'China',
  IN: 'India',
  SG: 'Singapore',
  HK: 'Hong Kong',
  AE: 'United Arab Emirates',
  SA: 'Saudi Arabia',
};

const getCountryColor = (count: number, max: number): string => {
  const intensity = count / max;
  if (intensity > 0.75) return '#215788';
  if (intensity > 0.5) return '#00B7B2';
  if (intensity > 0.25) return '#BED600';
  return '#E37222';
};

export function TargetMap({ data }: TargetMapProps) {
  const chartData = useMemo(() => {
    const sortedData = Object.entries(data)
      .map(([code, count]) => ({
        country: countryNames[code] || code,
        code,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15); // Top 15 countries

    const maxCount = Math.max(...sortedData.map(d => d.count));
    
    return sortedData.map(item => ({
      ...item,
      color: getCountryColor(item.count, maxCount),
    }));
  }, [data]);

  const totalTargets = useMemo(() => {
    return Object.values(data).reduce((sum, count) => sum + count, 0);
  }, [data]);

  const totalCountries = Object.keys(data).length;

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No geographic data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Badge variant="outline" className="text-sm">
            {formatNumber(totalTargets)} targets
          </Badge>
          <Badge variant="outline" className="text-sm">
            {totalCountries} countries
          </Badge>
        </div>
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart 
          data={chartData} 
          layout="vertical"
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            type="number" 
            stroke="#3C3C3B"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            type="category" 
            dataKey="country" 
            stroke="#3C3C3B"
            style={{ fontSize: '12px' }}
            width={90}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#F4F1E9',
              border: '1px solid #215788',
              borderRadius: '4px'
            }}
            formatter={(value: any) => [formatNumber(value), 'Targets']}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#215788' }} />
          <span>High concentration</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#00B7B2' }} />
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#BED600' }} />
          <span>Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#E37222' }} />
          <span>Minimal</span>
        </div>
      </div>
    </div>
  );
}