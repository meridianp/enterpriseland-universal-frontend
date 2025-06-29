import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  MapPin, 
  TrendingUp, 
  Users, 
  Globe, 
  Target, 
  Star,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useQualifiedTargets } from '@/lib/hooks/use-market-intel';
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from '@/lib/utils';

const businessModelIcons = {
  developer: Building2,
  investor: TrendingUp,
  operator: Users,
  platform: Globe,
  service: Target,
  other: Building2,
};

export function TargetCard() {
  const { data, isLoading } = useQualifiedTargets({ page_size: 6 });

  if (isLoading) {
    return (
      <>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-[#F4F1E9] h-[280px]">
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-1" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full mb-4" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </>
    );
  }

  if (!data?.results?.length) {
    return (
      <Card className="bg-[#F4F1E9] col-span-full">
        <CardContent className="flex flex-col items-center justify-center h-[200px] text-center">
          <Target className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No qualified targets found</p>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/market-intel/targets">
              View All Targets
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {data.results.slice(0, 6).map((target) => {
        const Icon = businessModelIcons[target.business_model as keyof typeof businessModelIcons] || Building2;
        
        return (
          <Card key={target.id} className="bg-[#F4F1E9] hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-[#3C3C3B] line-clamp-1">
                    <Link 
                      href={`/market-intel/targets/${target.id}`}
                      className="hover:text-[#215788] transition-colors"
                    >
                      {target.company_name}
                    </Link>
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{target.headquarters_city || 'Unknown'}, {target.headquarters_country || 'Unknown'}</span>
                  </div>
                </div>
                <Icon className="h-5 w-5 text-[#215788]" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Lead Score */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Lead Score</span>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold" style={{ color: '#BED600' }}>
                      {target.lead_score.toFixed(0)}
                    </span>
                    <Star className="h-4 w-4 text-[#BED600] fill-current" />
                  </div>
                </div>
                <Progress 
                  value={target.lead_score} 
                  className="h-2"
                />
              </div>

              {/* Business Model */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Model</span>
                <Badge variant="secondary" className="text-xs">
                  {target.business_model.replace('_', ' ')}
                </Badge>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="outline" className="text-xs capitalize">
                  {target.status.replace('_', ' ')}
                </Badge>
              </div>

              {/* Articles Count */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">News Articles</span>
                <span className="text-sm font-medium">{target.article_count || 0}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button asChild size="sm" variant="outline" className="flex-1">
                  <Link href={`/market-intel/targets/${target.id}`}>
                    View Details
                  </Link>
                </Button>
                {target.domain && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(target.domain, '_blank')}
                    className="px-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {data.count > 6 && (
        <Card className="bg-[#F4F1E9] col-span-full">
          <CardContent className="flex items-center justify-center h-full">
            <Button asChild variant="outline">
              <Link href="/market-intel/targets?qualified_only=true">
                View All {formatNumber(data.count)} Qualified Targets
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
}