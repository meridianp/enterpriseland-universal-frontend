'use client';

import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';
import type { LeadScoreComponent } from '@/lib/types/leads.types';

interface ScoreBreakdownProps {
  score: number;
  breakdown?: LeadScoreComponent[];
}

export function ScoreBreakdown({ score, breakdown }: ScoreBreakdownProps) {
  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'bg-green-600';
    if (percentage >= 60) return 'bg-yellow-600';
    if (percentage >= 40) return 'bg-orange-600';
    return 'bg-red-600';
  };

  if (!breakdown || breakdown.length === 0) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Overall Score</span>
          <span className={cn('font-medium', getScoreColor(score, 100))}>
            {score}/100
          </span>
        </div>
        <Progress value={score} className="h-2" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {breakdown.map((component, index) => {
        const percentage = (component.score / component.max_score) * 100;
        
        return (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {component.component.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              <span className={cn('text-sm font-medium', getScoreColor(component.score, component.max_score))}>
                {component.score}/{component.max_score}
              </span>
            </div>
            <div className="relative">
              <Progress 
                value={percentage} 
                className="h-1.5"
              />
              <div 
                className={cn(
                  'absolute inset-0 h-1.5 rounded-full transition-all',
                  getProgressColor(component.score, component.max_score)
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
            {component.weight !== 1 && (
              <p className="text-xs text-muted-foreground">
                Weight: {(component.weight * 100).toFixed(0)}%
              </p>
            )}
            {component.details && Object.keys(component.details).length > 0 && (
              <div className="text-xs text-muted-foreground space-y-0.5 pl-2">
                {Object.entries(component.details).map(([key, value]) => (
                  <div key={key}>
                    • {key.replace(/_/g, ' ')}: {String(value)}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      
      <div className="pt-2 mt-2 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Total Score</span>
          <span className={cn('text-lg font-bold', getScoreColor(score, 100))}>
            {score}
          </span>
        </div>
      </div>
    </div>
  );
}