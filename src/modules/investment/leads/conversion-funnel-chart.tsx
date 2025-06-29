'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';
import type { ConversionFunnel } from '@/lib/types/leads.types';

interface ConversionFunnelChartProps {
  funnel: ConversionFunnel;
}

export function ConversionFunnelChart({ funnel }: ConversionFunnelChartProps) {
  const stages = funnel.stages;
  const maxCount = Math.max(...stages.map(s => s.count));

  const getStageColor = (index: number, total: number) => {
    const percentage = ((total - index) / total) * 100;
    if (percentage >= 80) return 'bg-blue-500';
    if (percentage >= 60) return 'bg-indigo-500';
    if (percentage >= 40) return 'bg-purple-500';
    if (percentage >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Funnel</CardTitle>
        <CardDescription>
          Lead progression through your sales pipeline
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {stages.map((stage, index) => {
            const widthPercentage = (stage.count / maxCount) * 100;
            const previousCount = index > 0 ? stages[index - 1].count : stage.count;
            const conversionFromPrevious = previousCount > 0 
              ? ((stage.count / previousCount) * 100).toFixed(1)
              : '100.0';

            return (
              <div key={stage.status} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{stage.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">
                      {stage.count} leads
                    </span>
                    {stage.value > 0 && (
                      <span className="font-medium">
                        ${(stage.value / 1000000).toFixed(2)}M
                      </span>
                    )}
                    {index > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {conversionFromPrevious}% from previous
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="relative">
                  <div 
                    className="bg-muted rounded-lg overflow-hidden"
                    style={{ 
                      marginLeft: `${index * 20}px`,
                      marginRight: `${index * 20}px`,
                    }}
                  >
                    <div
                      className={cn(
                        'h-12 transition-all duration-500 flex items-center justify-between px-4',
                        getStageColor(index, stages.length)
                      )}
                      style={{ width: `${widthPercentage}%` }}
                    >
                      <span className="text-white font-medium text-sm">
                        {stage.conversion_rate.toFixed(1)}%
                      </span>
                      {stage.average_days > 0 && (
                        <span className="text-white/80 text-sm">
                          ~{stage.average_days.toFixed(0)} days
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold">
              {stages.length > 0 ? stages[stages.length - 1].conversion_rate.toFixed(1) : 0}%
            </p>
            <p className="text-sm text-muted-foreground">Overall Conversion</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              ${stages.reduce((sum, s) => sum + s.value, 0) / 1000000}M
            </p>
            <p className="text-sm text-muted-foreground">Total Pipeline Value</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              {stages.reduce((sum, s) => sum + s.average_days, 0).toFixed(0)} days
            </p>
            <p className="text-sm text-muted-foreground">Average Cycle Time</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}