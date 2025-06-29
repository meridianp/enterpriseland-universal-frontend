import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend
} from 'recharts';
import { useAnalysisInsights, useScoringInsights } from '@/lib/hooks/use-market-intel';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { formatDate, formatNumber } from '@/lib/utils';

interface DiscoveryMetricsProps {
  data?: Array<{
    date: string;
    articles_count: number;
    targets_count: number;
  }>;
}

export function DiscoveryMetrics({ data }: DiscoveryMetricsProps) {
  const { data: analysisInsights, isLoading: analysisLoading } = useAnalysisInsights(30);
  const { data: scoringInsights, isLoading: scoringLoading } = useScoringInsights();

  const activityData = useMemo(() => {
    if (!data) return [];
    return data.map(item => ({
      date: formatDate(item.date, 'MMM dd'),
      articles: item.articles_count,
      targets: item.targets_count,
    }));
  }, [data]);

  const sentimentData = useMemo(() => {
    if (!analysisInsights?.sentiment_distribution) return [];
    const dist = analysisInsights.sentiment_distribution;
    return [
      { name: 'Positive', value: dist.positive, color: '#BED600' },
      { name: 'Neutral', value: dist.neutral, color: '#3C3C3B' },
      { name: 'Negative', value: dist.negative, color: '#E37222' },
    ];
  }, [analysisInsights]);

  const scoreDistributionData = useMemo(() => {
    if (!scoringInsights?.score_distribution) return [];
    return scoringInsights.score_distribution.map(item => ({
      range: item.range,
      count: item.count,
    }));
  }, [scoringInsights]);

  const conversionFunnelData = useMemo(() => {
    if (!scoringInsights?.conversion_funnel) return [];
    return scoringInsights.conversion_funnel.map(item => ({
      stage: item.stage.replace('_', ' '),
      count: item.count,
      percentage: item.percentage,
    }));
  }, [scoringInsights]);

  if (analysisLoading || scoringLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-[#F4F1E9]">
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Activity Timeline */}
      {activityData.length > 0 && (
        <Card className="bg-[#F4F1E9] md:col-span-2">
          <CardHeader>
            <CardTitle className="text-[#3C3C3B] flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Discovery Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#3C3C3B"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#3C3C3B"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#F4F1E9',
                    border: '1px solid #215788',
                    borderRadius: '4px'
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="articles"
                  stackId="1"
                  stroke="#215788"
                  fill="#215788"
                  fillOpacity={0.6}
                  name="Articles"
                />
                <Area
                  type="monotone"
                  dataKey="targets"
                  stackId="1"
                  stroke="#00B7B2"
                  fill="#00B7B2"
                  fillOpacity={0.6}
                  name="Targets"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Sentiment Distribution */}
      {sentimentData.length > 0 && (
        <Card className="bg-[#F4F1E9]">
          <CardHeader>
            <CardTitle className="text-[#3C3C3B] flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Article Sentiment Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={sentimentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis type="number" stroke="#3C3C3B" />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="#3C3C3B"
                  width={80}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#F4F1E9',
                    border: '1px solid #215788',
                    borderRadius: '4px'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill={(entry: any) => entry.color}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Average Sentiment Score: {' '}
                <span className="font-medium text-[#3C3C3B]">
                  {analysisInsights?.average_relevance_score 
                    ? (analysisInsights.average_relevance_score * 100).toFixed(0) + '%'
                    : 'N/A'}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lead Score Distribution */}
      {scoreDistributionData.length > 0 && (
        <Card className="bg-[#F4F1E9]">
          <CardHeader>
            <CardTitle className="text-[#3C3C3B] flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Lead Score Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={scoreDistributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="range" 
                  stroke="#3C3C3B"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#3C3C3B"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#F4F1E9',
                    border: '1px solid #215788',
                    borderRadius: '4px'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#BED600"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Average Score: {' '}
                <span className="font-medium text-[#3C3C3B]">
                  {scoringInsights?.average_score?.toFixed(0) || 'N/A'}
                </span>
                {' • '}
                Qualified: {' '}
                <span className="font-medium text-[#BED600]">
                  {scoringInsights?.qualified_percentage?.toFixed(1) || 0}%
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conversion Funnel */}
      {conversionFunnelData.length > 0 && (
        <Card className="bg-[#F4F1E9] md:col-span-2">
          <CardHeader>
            <CardTitle className="text-[#3C3C3B] flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Target Conversion Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversionFunnelData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="stage" 
                  stroke="#3C3C3B"
                  style={{ fontSize: '12px' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#3C3C3B"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#F4F1E9',
                    border: '1px solid #215788',
                    borderRadius: '4px'
                  }}
                  formatter={(value: any, name: string) => {
                    if (name === 'percentage') {
                      return `${value}%`;
                    }
                    return value;
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#00B7B2"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Top Topics */}
      {analysisInsights?.top_topics && analysisInsights.top_topics.length > 0 && (
        <Card className="bg-[#F4F1E9]">
          <CardHeader>
            <CardTitle className="text-[#3C3C3B]">Top Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysisInsights.top_topics.slice(0, 10).map((topic, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm truncate max-w-[200px]">{topic.topic}</span>
                  <span className="text-sm font-medium text-[#215788]">
                    {topic.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Scoring Factors */}
      {scoringInsights?.top_factors && scoringInsights.top_factors.length > 0 && (
        <Card className="bg-[#F4F1E9]">
          <CardHeader>
            <CardTitle className="text-[#3C3C3B]">Key Scoring Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scoringInsights.top_factors.map((factor, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm capitalize">{factor.factor.replace('_', ' ')}</span>
                    <span className="text-sm font-medium text-[#00B7B2]">
                      +{factor.average_impact.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#00B7B2] h-2 rounded-full"
                      style={{ width: `${(factor.average_impact / 30) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}