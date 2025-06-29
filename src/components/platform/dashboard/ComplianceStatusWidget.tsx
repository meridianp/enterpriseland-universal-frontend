'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Building2,
  Users,
  FileText,
  Filter,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useRiskAnalytics, usePartnerAnalytics, useSchemeAnalytics } from '@/lib/hooks/useAnalyticsQueries';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from '@/lib/utils';

interface ComplianceStatusWidgetProps {
  className?: string;
  filters?: {
    time_period?: string;
    partner_ids?: string[];
    scheme_ids?: string[];
  };
}

interface ComplianceItem {
  id: string;
  type: 'partner' | 'scheme' | 'assessment';
  name: string;
  status: 'compliant' | 'warning' | 'critical' | 'pending';
  score: number;
  lastReviewed: string;
  issues: string[];
  category: string;
}

const COMPLIANCE_STATUS_CONFIG = {
  compliant: {
    label: 'Compliant',
    color: '#BED600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    icon: CheckCircle,
  },
  warning: {
    label: 'Warning',
    color: '#E37222',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    icon: AlertTriangle,
  },
  critical: {
    label: 'Critical',
    color: '#DC2626',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    icon: XCircle,
  },
  pending: {
    label: 'Pending Review',
    color: '#6B7280',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    icon: Clock,
  },
} as const;

export function ComplianceStatusWidget({ 
  className,
  filters 
}: ComplianceStatusWidgetProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const { 
    data: riskData, 
    isLoading: riskLoading, 
    error: riskError 
  } = useRiskAnalytics(filters);

  const { 
    data: partnerData, 
    isLoading: partnerLoading, 
    error: partnerError 
  } = usePartnerAnalytics(filters);

  const { 
    data: schemeData, 
    isLoading: schemeLoading, 
    error: schemeError 
  } = useSchemeAnalytics(filters);

  const isLoading = riskLoading || partnerLoading || schemeLoading;
  const error = riskError || partnerError || schemeError;

  // Generate mock compliance items (in real app, this would come from API)
  const complianceItems = useMemo((): ComplianceItem[] => {
    if (!riskData?.data || !partnerData?.data || !schemeData?.data) return [];

    const items: ComplianceItem[] = [];

    // Generate partner compliance items
    const partnerCount = partnerData.data.total_count;
    for (let i = 0; i < Math.min(partnerCount, 10); i++) {
      const score = Math.random() * 10;
      let status: ComplianceItem['status'];
      let issues: string[] = [];

      if (score >= 8) {
        status = 'compliant';
      } else if (score >= 6) {
        status = 'warning';
        issues = ['Documentation incomplete', 'License renewal due'];
      } else if (score >= 4) {
        status = 'critical';
        issues = ['Regulatory violations', 'Insurance expired', 'Audit overdue'];
      } else {
        status = 'pending';
        issues = ['Awaiting review'];
      }

      items.push({
        id: `partner-${i}`,
        type: 'partner',
        name: `Partner ${i + 1}`,
        status,
        score,
        lastReviewed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        issues,
        category: 'Partner Management'
      });
    }

    // Generate scheme compliance items
    const schemeCount = schemeData.data.total_count;
    for (let i = 0; i < Math.min(schemeCount, 8); i++) {
      const score = Math.random() * 10;
      let status: ComplianceItem['status'];
      let issues: string[] = [];

      if (score >= 8) {
        status = 'compliant';
      } else if (score >= 6) {
        status = 'warning';
        issues = ['Planning permission review needed'];
      } else if (score >= 4) {
        status = 'critical';
        issues = ['Building standards non-compliance', 'Environmental concerns'];
      } else {
        status = 'pending';
        issues = ['Initial assessment pending'];
      }

      items.push({
        id: `scheme-${i}`,
        type: 'scheme',
        name: `Scheme ${i + 1}`,
        status,
        score,
        lastReviewed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        issues,
        category: 'Development Schemes'
      });
    }

    return items;
  }, [riskData?.data, partnerData?.data, schemeData?.data]);

  // Filter compliance items
  const filteredItems = useMemo(() => {
    let filtered = [...complianceItems];

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    return filtered.sort((a, b) => {
      // Sort by status priority (critical first), then by score
      const statusPriority = { critical: 3, warning: 2, pending: 1, compliant: 0 };
      const aPriority = statusPriority[a.status];
      const bPriority = statusPriority[b.status];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return a.score - b.score;
    });
  }, [complianceItems, selectedStatus, selectedType]);

  // Calculate summary statistics
  const complianceSummary = useMemo(() => {
    const total = complianceItems.length;
    const byStatus = complianceItems.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const overallScore = total > 0 
      ? complianceItems.reduce((sum, item) => sum + item.score, 0) / total 
      : 0;

    const criticalCount = byStatus.critical || 0;
    const warningCount = byStatus.warning || 0;
    const alertCount = criticalCount + warningCount;

    return {
      total,
      byStatus,
      alertCount,
      overallScore,
      complianceRate: total > 0 ? ((byStatus.compliant || 0) / total) * 100 : 0
    };
  }, [complianceItems]);

  const getStatusIcon = (status: keyof typeof COMPLIANCE_STATUS_CONFIG) => {
    const IconComponent = COMPLIANCE_STATUS_CONFIG[status].icon;
    return IconComponent;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Compliance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Failed to load compliance data. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#215788]" />
            <CardTitle>Compliance Status</CardTitle>
            {complianceSummary.alertCount > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {complianceSummary.alertCount} alerts
              </Badge>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#215788]">
              {complianceSummary.complianceRate.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Overall Compliance</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {/* Status Summary Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(COMPLIANCE_STATUS_CONFIG).map(([status, config]) => {
                const count = complianceSummary.byStatus[status] || 0;
                const IconComponent = config.icon;
                
                return (
                  <div 
                    key={status}
                    className={cn("p-4 rounded-lg border", config.bgColor)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <IconComponent 
                        className="h-5 w-5" 
                        style={{ color: config.color }}
                      />
                      <span className="text-2xl font-bold" style={{ color: config.color }}>
                        {count}
                      </span>
                    </div>
                    <div className="text-sm font-medium">{config.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {complianceSummary.total > 0 
                        ? ((count / complianceSummary.total) * 100).toFixed(1)
                        : 0}%
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Overall Score */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Compliance Score</span>
                <span className="text-sm font-bold">
                  {complianceSummary.overallScore.toFixed(1)}/10
                </span>
              </div>
              <Progress 
                value={complianceSummary.overallScore * 10} 
                className="h-3"
              />
            </div>

            {/* Recent Alerts */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Critical Issues Requiring Attention
              </h4>
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {filteredItems
                    .filter(item => item.status === 'critical')
                    .slice(0, 5)
                    .map(item => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-red-600">
                            {item.issues.slice(0, 2).join(', ')}
                          </p>
                        </div>
                        <Badge variant="destructive" className="text-xs">
                          Critical
                        </Badge>
                      </div>
                    ))}
                  {filteredItems.filter(item => item.status === 'critical').length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      <CheckCircle className="h-6 w-6 mx-auto mb-1 text-green-600" />
                      <p className="text-sm">No critical issues found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4">
            {/* Filters */}
            <div className="flex gap-2 items-center">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Button
                variant={selectedStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedStatus('all')}
              >
                All ({complianceSummary.total})
              </Button>
              {Object.entries(COMPLIANCE_STATUS_CONFIG).map(([status, config]) => {
                const count = complianceSummary.byStatus[status] || 0;
                return (
                  <Button
                    key={status}
                    variant={selectedStatus === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedStatus(status)}
                    className={selectedStatus === status ? config.bgColor : ''}
                  >
                    {config.label} ({count})
                  </Button>
                );
              })}
            </div>

            {/* Detailed List */}
            <ScrollArea className="h-80">
              <div className="space-y-3">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No items found matching your filters</p>
                  </div>
                ) : (
                  filteredItems.map(item => {
                    const statusConfig = COMPLIANCE_STATUS_CONFIG[item.status];
                    const IconComponent = statusConfig.icon;
                    const TypeIcon = item.type === 'partner' ? Users : 
                                   item.type === 'scheme' ? Building2 : FileText;
                    
                    return (
                      <div key={item.id} className="flex gap-3 p-3 bg-[#F4F1E9] rounded-lg">
                        <div className="flex-shrink-0">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${statusConfig.color}20` }}
                          >
                            <IconComponent 
                              className="h-5 w-5" 
                              style={{ color: statusConfig.color }}
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <TypeIcon className="h-4 w-4 text-muted-foreground" />
                                <h4 className="font-medium text-sm">{item.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {item.category}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground mb-2">
                                Score: {item.score.toFixed(1)}/10 • Last reviewed: {formatDate(item.lastReviewed)}
                              </div>
                              {item.issues.length > 0 && (
                                <div className="space-y-1">
                                  {item.issues.slice(0, 3).map((issue, index) => (
                                    <div key={index} className="flex items-center gap-1">
                                      <div className="w-1 h-1 rounded-full bg-current opacity-50" />
                                      <span className="text-xs text-muted-foreground">{issue}</span>
                                    </div>
                                  ))}
                                  {item.issues.length > 3 && (
                                    <div className="text-xs text-muted-foreground">
                                      +{item.issues.length - 3} more issues
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            <Badge 
                              variant={item.status === 'critical' ? 'destructive' : 'outline'}
                              className="text-xs"
                            >
                              {statusConfig.label}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Compliance Trend (Mock Data) */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Compliance Trend
          </h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">+2.3%</div>
                <div className="text-xs text-muted-foreground">This month</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">94.2%</div>
                <div className="text-xs text-muted-foreground">Average</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[#215788]">98.1%</div>
                <div className="text-xs text-muted-foreground">Target</div>
              </div>
            </div>
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}