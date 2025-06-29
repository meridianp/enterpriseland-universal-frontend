'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LeadScoringModel } from '@/lib/types/leads.types';

interface ModelPerformanceChartProps {
  models: LeadScoringModel[];
}

const COLORS = ['#215788', '#00B7B2', '#BED600', '#E37222', '#9333EA'];

export function ModelPerformanceChart({ models }: ModelPerformanceChartProps) {
  // Prepare data for radar chart
  const radarData = [
    { metric: 'Accuracy', fullMark: 100 },
    { metric: 'Precision', fullMark: 100 },
    { metric: 'Recall', fullMark: 100 },
    { metric: 'F1 Score', fullMark: 100 },
  ];

  models.forEach((model, index) => {
    radarData.forEach(item => {
      const key = item.metric.toLowerCase().replace(' ', '_');
      (item as any)[model.name] = (model.performance_metrics[key as keyof typeof model.performance_metrics] || 0) * 100;
    });
  });

  // Prepare data for bar chart
  const barData = models.map((model, index) => ({
    name: model.name,
    accuracy: (model.performance_metrics.accuracy || 0) * 100,
    precision: (model.performance_metrics.precision || 0) * 100,
    recall: (model.performance_metrics.recall || 0) * 100,
    f1_score: (model.performance_metrics.f1_score || 0) * 100,
    color: COLORS[index % COLORS.length],
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm">
              <span style={{ color: entry.color }}>{entry.name}:</span> {entry.value.toFixed(1)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Tabs defaultValue="radar" className="space-y-4">
      <TabsList>
        <TabsTrigger value="radar">Radar View</TabsTrigger>
        <TabsTrigger value="comparison">Side-by-Side</TabsTrigger>
      </TabsList>

      <TabsContent value="radar">
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid strokeDasharray="3 3" />
            <PolarAngleAxis dataKey="metric" className="text-xs" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            {models.map((model, index) => (
              <Radar
                key={model.id}
                name={model.name}
                dataKey={model.name}
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            ))}
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </TabsContent>

      <TabsContent value="comparison">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="name" 
              className="text-xs"
              tick={{ fill: '#888' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: '#888' }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="accuracy" fill="#215788" />
            <Bar dataKey="precision" fill="#00B7B2" />
            <Bar dataKey="recall" fill="#BED600" />
            <Bar dataKey="f1_score" fill="#E37222" />
          </BarChart>
        </ResponsiveContainer>
      </TabsContent>
    </Tabs>
  );
}