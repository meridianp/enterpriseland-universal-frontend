'use client';

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from 'next-themes';

interface RiskTrendData {
  date: string;
  low: number;
  medium: number;
  high: number;
  critical: number;
}

interface RiskTrendChartProps {
  data: RiskTrendData[];
  className?: string;
}

export function RiskTrendChart({ data, className }: RiskTrendChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="text-sm" style={{ color: entry.color }}>
                {entry.name}:
              </span>
              <span className="text-sm font-medium">{entry.value}</span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total:</span>
              <span className="text-sm font-medium">
                {payload.reduce((sum: number, entry: any) => sum + entry.value, 0)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Risk Trend Analysis</CardTitle>
        <CardDescription>
          Risk levels distribution over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDark ? '#374151' : '#e5e7eb'}
              />
              <XAxis 
                dataKey="date" 
                tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
              />
              <YAxis 
                tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="low" 
                name="Low Risk"
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="medium" 
                name="Medium Risk"
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="high" 
                name="High Risk"
                stroke="#f97316" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="critical" 
                name="Critical Risk"
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}