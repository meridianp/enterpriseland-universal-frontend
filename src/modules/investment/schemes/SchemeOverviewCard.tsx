'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Home, 
  Building2, 
  DollarSign, 
  Calendar,
  MapPin,
  GraduationCap,
  TrendingUp,
  Users,
  Clock,
  AlertCircle
} from 'lucide-react';
import { 
  type PBSAScheme, 
  type SchemeLocationInformation, 
  type TargetUniversity, 
  type SchemeSiteInformation,
  DevelopmentStage
} from '@/lib/types/scheme.types';
import { cn } from '@/lib/utils';

interface SchemeOverviewCardProps {
  scheme: PBSAScheme;
  location?: SchemeLocationInformation;
  universities?: TargetUniversity[];
  site?: SchemeSiteInformation;
}

const getDevelopmentStageColor = (stage: DevelopmentStage) => {
  switch (stage) {
    case DevelopmentStage.CONCEPT:
    case DevelopmentStage.FEASIBILITY:
      return 'bg-slate-100 text-slate-800 border-slate-300';
    case DevelopmentStage.PLANNING:
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case DevelopmentStage.PRE_CONSTRUCTION:
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case DevelopmentStage.CONSTRUCTION:
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case DevelopmentStage.OPERATIONAL:
      return 'bg-green-100 text-green-800 border-green-300';
    case DevelopmentStage.DISPOSED:
      return 'bg-gray-100 text-gray-800 border-gray-300';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-300';
  }
};

const formatCurrency = (amount?: number, currency?: string) => {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date?: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });
};

export function SchemeOverviewCard({ scheme, location, universities = [], site }: SchemeOverviewCardProps) {
  const stageName = DevelopmentStage[scheme.development_stage].replace(/_/g, ' ');
  const priorityColor = scheme.assessment_priority === 'high' ? 'text-red-600' : 
                       scheme.assessment_priority === 'medium' ? 'text-yellow-600' : 'text-gray-600';

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Scheme Overview</CardTitle>
            <CardDescription>Key information and metrics at a glance</CardDescription>
          </div>
          <Badge 
            variant="outline" 
            className={cn("text-xs", getDevelopmentStageColor(scheme.development_stage))}
          >
            {stageName}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Total Beds */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Home className="h-4 w-4" />
              <span>Total Beds</span>
            </div>
            <p className="text-2xl font-bold">{scheme.total_beds.toLocaleString()}</p>
            {scheme.total_units && (
              <p className="text-sm text-muted-foreground">{scheme.total_units} units</p>
            )}
          </div>

          {/* Cost per Bed */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Cost per Bed</span>
            </div>
            <p className="text-2xl font-bold">
              {scheme.cost_per_bed ? 
                formatCurrency(scheme.cost_per_bed, scheme.total_development_cost_currency) : 
                'N/A'
              }
            </p>
            {scheme.total_development_cost_amount && (
              <p className="text-sm text-muted-foreground">
                Total: {formatCurrency(scheme.total_development_cost_amount, scheme.total_development_cost_currency)}
              </p>
            )}
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Timeline</span>
            </div>
            <p className="text-2xl font-bold">
              {scheme.development_timeline_months ? `${scheme.development_timeline_months}m` : 'N/A'}
            </p>
            {scheme.expected_completion_date && (
              <p className="text-sm text-muted-foreground">
                Complete: {formatDate(scheme.expected_completion_date)}
              </p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Location</span>
            </div>
            <p className="text-2xl font-bold">{location?.city || 'N/A'}</p>
            {location?.country && (
              <p className="text-sm text-muted-foreground">{location.country}</p>
            )}
          </div>
        </div>

        {/* Additional Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pt-6 border-t">
          {/* Universities */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap className="h-4 w-4" />
              <span>Target Universities</span>
            </div>
            <p className="text-lg font-semibold">{universities.length}</p>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Priority</span>
            </div>
            <p className={cn("text-lg font-semibold capitalize", priorityColor)}>
              {scheme.assessment_priority}
            </p>
          </div>

          {/* Beds per Unit */}
          {scheme.beds_per_unit && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Beds per Unit</span>
              </div>
              <p className="text-lg font-semibold">{scheme.beds_per_unit.toFixed(1)}</p>
            </div>
          )}

          {/* Planning Risk */}
          {site?.planning_risk_assessment && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <span>Planning Risk</span>
              </div>
              <Badge 
                variant={site.planning_risk_assessment.risk_level === 'HIGH' ? 'destructive' : 
                         site.planning_risk_assessment.risk_level === 'MEDIUM' ? 'default' : 'secondary'}
              >
                {site.planning_risk_assessment.risk_level}
              </Badge>
            </div>
          )}
        </div>

        {/* Developer Info */}
        {scheme.developer_data && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Building2 className="h-4 w-4" />
              <span>Developer</span>
            </div>
            <p className="font-medium">{scheme.developer_data.company_name}</p>
            <p className="text-sm text-muted-foreground">{scheme.developer_data.country}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}