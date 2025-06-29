'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from 'date-fns';

interface LeadTrendChartProps {
  data: Array<{
    date: string;
    count?: number;
    [key: string]: any;
  }>;
  title: string;
  description?: string;
  dataKey?: string;
  valueFormat?: (value: number) => string;
}

export function LeadTrendChart({ 
  data, 
  title, 
  description,
  dataKey = 'count',
  valueFormat = (value) => value.toString(),
}: LeadTrendChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    date: format(new Date(item.date), 'MMM d'),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              className="text-xs"
              tick={{ fill: '#888' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: '#888' }}
              tickFormatter={valueFormat}
            />
            <Tooltip 
              formatter={(value: number) => valueFormat(value)}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="#215788"
              strokeWidth={2}
              dot={{ fill: '#215788', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}