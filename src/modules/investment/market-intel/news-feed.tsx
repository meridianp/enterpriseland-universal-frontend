import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  ExternalLink, 
  Calendar, 
  Globe,
  TrendingUp,
  AlertCircle,
  Sparkles,
  BarChart3,
  Target,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useRelevantArticles, useAnalyzeArticle, useIdentifyTargets } from '@/lib/hooks/use-market-intel';
import { formatDate } from '@/lib/utils';
import { NewsArticle } from '@/lib/types/market-intelligence.types';

export function NewsFeed() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useRelevantArticles({ 
    page, 
    page_size: 20,
    ordering: '-published_date' 
  });
  const analyzeArticleMutation = useAnalyzeArticle();
  const identifyTargetsMutation = useIdentifyTargets();

  if (isLoading && page === 1) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="bg-[#F4F1E9]">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load news feed. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  const articles = data?.results || [];

  if (articles.length === 0) {
    return (
      <Card className="bg-[#F4F1E9]">
        <CardContent className="flex flex-col items-center justify-center h-[300px] text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground mb-4">No relevant articles found</p>
          <Button asChild variant="outline">
            <Link href="/market-intel/news">
              View All Articles
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const ArticleCard = ({ article }: { article: NewsArticle }) => {
    const sentimentColor = article.sentiment_score 
      ? article.sentiment_score > 0.3 ? '#BED600' 
      : article.sentiment_score < -0.3 ? '#E37222' 
      : '#3C3C3B'
      : '#3C3C3B';
    
    const sentimentLabel = article.sentiment_score
      ? article.sentiment_score > 0.3 ? 'Positive'
      : article.sentiment_score < -0.3 ? 'Negative'
      : 'Neutral'
      : 'Unknown';

    return (
      <Card className="bg-[#F4F1E9] hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-[#3C3C3B] line-clamp-2">
                <Link 
                  href={`/market-intel/news/${article.id}`}
                  className="hover:text-[#215788] transition-colors"
                >
                  {article.title}
                </Link>
              </h3>
              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  <span>{article.source}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(article.published_date)}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge 
                variant="secondary" 
                className="text-xs"
                style={{ backgroundColor: '#BED600', color: '#3C3C3B' }}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                {(article.relevance_score * 100).toFixed(0)}% relevant
              </Badge>
              <Badge 
                variant="outline" 
                className="text-xs"
                style={{ borderColor: sentimentColor, color: sentimentColor }}
              >
                {sentimentLabel}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-[#3C3C3B] line-clamp-3">
            {article.summary || article.content.substring(0, 200)}...
          </p>
          
          {/* Topics */}
          {article.topics && article.topics.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {article.topics.slice(0, 5).map((topic, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {topic}
                </Badge>
              ))}
              {article.topics.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{article.topics.length - 5} more
                </Badge>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => window.open(article.url, '_blank')}
                className="text-xs"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Read Original
              </Button>
              {article.status === 'pending' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => analyzeArticleMutation.mutate(article.id)}
                  disabled={analyzeArticleMutation.isPending}
                  className="text-xs"
                >
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Analyze
                </Button>
              )}
              {article.status === 'relevant' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => identifyTargetsMutation.mutate([article.id])}
                  disabled={identifyTargetsMutation.isPending}
                  className="text-xs text-[#00B7B2] hover:text-[#00B7B2]"
                >
                  <Target className="h-3 w-3 mr-1" />
                  Identify Targets
                </Button>
              )}
            </div>
            
            {/* Related Targets Count */}
            {article.related_targets && article.related_targets.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {article.related_targets.length} targets
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#3C3C3B]">Recent Relevant Articles</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/market-intel/news">
              View All
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[800px] pr-4">
        <div className="space-y-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {/* Load More */}
        {data && data.next && (
          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Load More Articles'}
            </Button>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}