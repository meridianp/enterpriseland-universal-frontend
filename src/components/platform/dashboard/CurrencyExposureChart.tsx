'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from '@/lib/utils';

interface CurrencyData {
  currency: string;
  amount: number;
  percentage: number;
}

interface CurrencyExposureChartProps {
  data: CurrencyData[];
  className?: string;
}

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
];

export function CurrencyExposureChart({ data, className }: CurrencyExposureChartProps) {
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm">
            Amount: {formatCurrency(data.value, data.payload.currency)}
          </p>
          <p className="text-sm text-muted-foreground">
            {data.payload.percentage.toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = (entry: any) => {
    return `${entry.currency} (${entry.percentage.toFixed(1)}%)`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Currency Exposure</CardTitle>
        <CardDescription>
          Distribution of assessments by currency
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
                nameKey="currency"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Currency breakdown */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Total Exposure</span>
            <span>{total.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
          </div>
          <div className="space-y-1">
            {data.map((item, index) => (
              <div key={item.currency} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-muted-foreground">{item.currency}</span>
                </div>
                <span>{formatCurrency(item.amount, item.currency as any)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}