'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Building2,
  GraduationCap,
  Map,
  DollarSign,
  Settings,
  Calendar,
  Home,
  Train,
  Plane,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Ruler,
  Layers,
  Mountain,
  Droplets,
  Zap,
  FileText,
  TrendingUp
} from 'lucide-react';
import { 
  type PBSAScheme, 
  type SchemeLocationInformation, 
  type TargetUniversity, 
  type SchemeSiteInformation,
  DevelopmentStage,
  PlanningStatus,
  UniversityType
} from '@/lib/types/scheme.types';
import { cn } from '@/lib/utils';
import { SchemeLocationMap } from './SchemeLocationMap';
import { SchemeFinancialChart } from './SchemeFinancialChart';

interface SchemeDetailTabsProps {
  scheme: PBSAScheme;
  location?: SchemeLocationInformation;
  universities?: TargetUniversity[];
  site?: SchemeSiteInformation;
}

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
    day: 'numeric',
  });
};

const getDevelopmentStageInfo = (stage: DevelopmentStage) => {
  const stages = {
    [DevelopmentStage.CONCEPT]: { label: 'Concept', progress: 10, color: 'bg-slate-500' },
    [DevelopmentStage.FEASIBILITY]: { label: 'Feasibility', progress: 25, color: 'bg-blue-500' },
    [DevelopmentStage.PLANNING]: { label: 'Planning', progress: 40, color: 'bg-yellow-500' },
    [DevelopmentStage.PRE_CONSTRUCTION]: { label: 'Pre-Construction', progress: 60, color: 'bg-orange-500' },
    [DevelopmentStage.CONSTRUCTION]: { label: 'Construction', progress: 80, color: 'bg-amber-500' },
    [DevelopmentStage.OPERATIONAL]: { label: 'Operational', progress: 100, color: 'bg-green-500' },
    [DevelopmentStage.DISPOSED]: { label: 'Disposed', progress: 100, color: 'bg-gray-500' },
  };
  return stages[stage] || { label: stage, progress: 0, color: 'bg-gray-500' };
};

const getPlanningStatusInfo = (status: PlanningStatus) => {
  const statuses = {
    [PlanningStatus.PRE_APPLICATION]: { label: 'Pre-Application', icon: Clock, color: 'text-slate-600' },
    [PlanningStatus.SUBMITTED]: { label: 'Submitted', icon: FileText, color: 'text-blue-600' },
    [PlanningStatus.UNDER_REVIEW]: { label: 'Under Review', icon: Clock, color: 'text-yellow-600' },
    [PlanningStatus.APPROVED]: { label: 'Approved', icon: CheckCircle, color: 'text-green-600' },
    [PlanningStatus.REFUSED]: { label: 'Refused', icon: AlertCircle, color: 'text-red-600' },
    [PlanningStatus.APPEALED]: { label: 'Appealed', icon: AlertCircle, color: 'text-orange-600' },
    [PlanningStatus.CONDITIONS]: { label: 'Approved with Conditions', icon: CheckCircle, color: 'text-blue-600' },
  };
  return statuses[status] || { label: status, icon: AlertCircle, color: 'text-gray-600' };
};

export function SchemeDetailTabs({ scheme, location, universities = [], site }: SchemeDetailTabsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const stageInfo = getDevelopmentStageInfo(scheme.development_stage);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="location">Location</TabsTrigger>
        <TabsTrigger value="universities">Universities</TabsTrigger>
        <TabsTrigger value="site">Site Info</TabsTrigger>
        <TabsTrigger value="economics">Economics</TabsTrigger>
        <TabsTrigger value="operations">Operations</TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Development Timeline</CardTitle>
            <CardDescription>Project development progress and key milestones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Current Stage: {stageInfo.label}</span>
                <span className="text-sm text-muted-foreground">{stageInfo.progress}%</span>
              </div>
              <Progress value={stageInfo.progress} className="h-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Construction Start</span>
                </div>
                <p className="font-medium">{formatDate(scheme.construction_start_date)}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Expected Completion</span>
                </div>
                <p className="font-medium">{formatDate(scheme.expected_completion_date)}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Operational Start</span>
                </div>
                <p className="font-medium">{formatDate(scheme.operational_start_date)}</p>
              </div>
            </div>

            {scheme.development_timeline_months && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Total development timeline: <strong>{scheme.development_timeline_months} months</strong>
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
            <CardDescription>Essential scheme performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Home className="h-4 w-4" />
                  <span>Total Beds</span>
                </div>
                <p className="text-2xl font-bold">{scheme.total_beds.toLocaleString()}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>Total Units</span>
                </div>
                <p className="text-2xl font-bold">{scheme.total_units?.toLocaleString() || 'N/A'}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Beds per Unit</span>
                </div>
                <p className="text-2xl font-bold">{scheme.beds_per_unit?.toFixed(1) || 'N/A'}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>Priority</span>
                </div>
                <Badge variant={scheme.assessment_priority === 'high' ? 'destructive' : 
                               scheme.assessment_priority === 'medium' ? 'default' : 'secondary'}>
                  {scheme.assessment_priority.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Location Tab */}
      <TabsContent value="location" className="space-y-4">
        {location ? (
          <>
            <SchemeLocationMap location={location} universities={universities} />
            
            <Card>
              <CardHeader>
                <CardTitle>Location Details</CardTitle>
                <CardDescription>Geographic and transport information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Address</h4>
                      <p className="text-sm text-muted-foreground">
                        {location.address}<br />
                        {location.city}, {location.region}<br />
                        {location.country} {location.postcode}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Location Type</h4>
                      <Badge variant="outline">
                        {location.location_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Train className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Nearest Train Station</p>
                        <p className="text-sm text-muted-foreground">
                          {location.nearest_train_station || 'N/A'}
                          {location.train_station_distance_km && ` (${location.train_station_distance_km} km)`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Plane className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Airport Proximity</p>
                        <p className="text-sm text-muted-foreground">{location.airport_proximity || 'N/A'}</p>
                      </div>
                    </div>

                    {location.public_transport_rating && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Public Transport Rating</p>
                          <div className="flex items-center gap-2">
                            <Progress value={location.public_transport_rating * 20} className="h-2 w-24" />
                            <span className="text-sm text-muted-foreground">{location.public_transport_rating}/5</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Market Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Student Population</p>
                      <p className="font-medium">{location.total_student_population?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Competitive Schemes</p>
                      <p className="font-medium">{location.competitive_schemes_nearby || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Transport Score</p>
                      <p className="font-medium">{location.transport_accessibility_score || 'N/A'}</p>
                    </div>
                  </div>
                  
                  {location.local_market_description && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm">{location.local_market_description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No location information available</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      {/* Universities Tab */}
      <TabsContent value="universities" className="space-y-4">
        {universities.length > 0 ? (
          <div className="grid gap-4">
            {universities.map((university) => (
              <Card key={university.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        {university.university_name}
                      </CardTitle>
                      <CardDescription>
                        {university.university_type.replace(/_/g, ' ')} • {university.distance_to_campus_km} km from scheme
                      </CardDescription>
                    </div>
                    <Badge variant="outline">
                      Proximity Score: {university.proximity_score}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Walking Time</p>
                      <p className="font-medium">{university.walking_time_minutes ? `${university.walking_time_minutes} min` : 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Cycling Time</p>
                      <p className="font-medium">{university.cycling_time_minutes ? `${university.cycling_time_minutes} min` : 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Public Transport</p>
                      <p className="font-medium">{university.public_transport_time_minutes ? `${university.public_transport_time_minutes} min` : 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total Students</p>
                      <p className="font-medium">{university.total_student_population?.toLocaleString() || 'N/A'}</p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">International Students</p>
                      <p className="font-medium">{university.international_student_pct ? `${university.international_student_pct}%` : 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Postgraduate Students</p>
                      <p className="font-medium">{university.postgraduate_student_pct ? `${university.postgraduate_student_pct}%` : 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">University Beds</p>
                      <p className="font-medium">{university.university_provided_beds?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Demand Capture</p>
                      <p className="font-medium">{university.estimated_demand_capture_pct ? `${university.estimated_demand_capture_pct}%` : 'N/A'}</p>
                    </div>
                  </div>

                  {university.target_student_segment && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm">
                        <span className="font-medium">Target Segment:</span> {university.target_student_segment}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No target universities defined</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      {/* Site Info Tab */}
      <TabsContent value="site" className="space-y-4">
        {site ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Site Characteristics</CardTitle>
                <CardDescription>Physical site details and configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Ruler className="h-4 w-4" />
                      <span>Site Area</span>
                    </div>
                    <p className="font-medium">
                      {site.site_area_value} {site.site_area_unit}
                      <span className="text-sm text-muted-foreground block">
                        ({site.site_area_sq_m.toLocaleString()} sq m)
                      </span>
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Layers className="h-4 w-4" />
                      <span>Configuration</span>
                    </div>
                    <p className="font-medium capitalize">{site.site_configuration.replace(/_/g, ' ')}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>Max Height</span>
                    </div>
                    <p className="font-medium">{site.max_height_stories ? `${site.max_height_stories} stories` : 'N/A'}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Home className="h-4 w-4" />
                      <span>Beds/Hectare</span>
                    </div>
                    <p className="font-medium">{site.beds_per_hectare?.toFixed(0) || 'N/A'}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Mountain className="h-4 w-4" />
                      Topography
                    </h4>
                    <Badge variant="outline" className="capitalize">
                      {site.topography?.replace(/_/g, ' ') || 'Not specified'}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Ground Conditions</h4>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "capitalize",
                        site.ground_conditions === 'excellent' && "border-green-600 text-green-600",
                        site.ground_conditions === 'good' && "border-blue-600 text-blue-600",
                        site.ground_conditions === 'average' && "border-yellow-600 text-yellow-600",
                        site.ground_conditions === 'poor' && "border-orange-600 text-orange-600",
                        site.ground_conditions === 'very_poor' && "border-red-600 text-red-600"
                      )}
                    >
                      {site.ground_conditions?.replace(/_/g, ' ') || 'Not assessed'}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Plot Ratio</h4>
                    <p className="text-lg">{site.plot_ratio || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Planning Status</CardTitle>
                <CardDescription>Current planning application status and details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  {(() => {
                    const statusInfo = getPlanningStatusInfo(site.planning_status);
                    const Icon = statusInfo.icon;
                    return (
                      <>
                        <Icon className={cn("h-5 w-5", statusInfo.color)} />
                        <span className="font-medium">{statusInfo.label}</span>
                      </>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {site.planning_reference && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Reference</p>
                      <p className="font-medium">{site.planning_reference}</p>
                    </div>
                  )}
                  {site.planning_submission_date && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Submission Date</p>
                      <p className="font-medium">{formatDate(site.planning_submission_date)}</p>
                    </div>
                  )}
                  {site.planning_decision_date && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Decision Date</p>
                      <p className="font-medium">{formatDate(site.planning_decision_date)}</p>
                    </div>
                  )}
                </div>

                {site.planning_conditions && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Planning Conditions</h4>
                    <p className="text-sm">{site.planning_conditions}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Site Risks & Opportunities</CardTitle>
                <CardDescription>Risk assessment and development considerations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-medium">Contamination Risk</span>
                    </div>
                    <Badge 
                      variant={site.contamination_risk === 'HIGH' ? 'destructive' : 
                               site.contamination_risk === 'MEDIUM' ? 'default' : 'secondary'}
                    >
                      {site.contamination_risk || 'Not assessed'}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4" />
                      <span className="font-medium">Flood Risk</span>
                    </div>
                    <Badge 
                      variant={site.flood_risk === 'HIGH' ? 'destructive' : 
                               site.flood_risk === 'MEDIUM' ? 'default' : 'secondary'}
                    >
                      {site.flood_risk || 'Not assessed'}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      <span className="font-medium">Feasibility Score</span>
                    </div>
                    <Badge variant="outline">
                      {site.development_feasibility_score}/100
                    </Badge>
                  </div>
                </div>

                {(site.development_constraints || site.design_opportunities || site.environmental_considerations) && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {site.development_constraints && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Development Constraints</h4>
                        <p className="text-sm text-muted-foreground">{site.development_constraints}</p>
                      </div>
                    )}
                    {site.design_opportunities && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Design Opportunities</h4>
                        <p className="text-sm text-muted-foreground">{site.design_opportunities}</p>
                      </div>
                    )}
                    {site.environmental_considerations && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Environmental Considerations</h4>
                        <p className="text-sm text-muted-foreground">{site.environmental_considerations}</p>
                      </div>
                    )}
                  </div>
                )}

                {site.infrastructure_upgrades_required && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Infrastructure Upgrades Required</h4>
                    <p className="text-sm">{site.infrastructure_upgrades_required}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Layers className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No site information available</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      {/* Economics Tab */}
      <TabsContent value="economics" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
            <CardDescription>Development costs and financial metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>Total Development Cost</span>
                </div>
                <p className="text-2xl font-bold">
                  {formatCurrency(scheme.total_development_cost_amount, scheme.total_development_cost_currency)}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>Cost per Bed</span>
                </div>
                <p className="text-2xl font-bold">
                  {formatCurrency(scheme.cost_per_bed, scheme.total_development_cost_currency)}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>Estimated GCD</span>
                </div>
                <p className="text-2xl font-bold">
                  {formatCurrency(scheme.estimated_gcd_amount, scheme.estimated_gcd_currency)}
                </p>
              </div>
            </div>

            <Separator />

            <SchemeFinancialChart scheme={scheme} />
          </CardContent>
        </Card>
      </TabsContent>

      {/* Operations Tab */}
      <TabsContent value="operations" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Operational Information</CardTitle>
            <CardDescription>Scheme operational status and details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Operational Status</p>
                    <p className="text-sm text-muted-foreground">
                      {scheme.is_active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>

                {scheme.operational_start_date && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Operational Since</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(scheme.operational_start_date)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Assessment Priority</p>
                  <Badge variant={scheme.assessment_priority === 'high' ? 'destructive' : 
                                 scheme.assessment_priority === 'medium' ? 'default' : 'secondary'}>
                    {scheme.assessment_priority.toUpperCase()} PRIORITY
                  </Badge>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Last Updated</p>
                  <p className="text-sm">{formatDate(scheme.updated_at)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}