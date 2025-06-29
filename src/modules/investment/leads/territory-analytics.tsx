'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, TrendingUp, BarChart3, MapPin, Target, Award, AlertTriangle } from 'lucide-react';
import { api } from "@/lib/platform-api";

interface TerritoryAnalyticsProps {
  territoryPerformance: any;
  workloadBalance: any;
  leads: any[];
}

export function TerritoryAnalytics({ territoryPerformance, workloadBalance, leads }: TerritoryAnalyticsProps) {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  // Fetch territory analysis for selected member
  const { data: memberTerritoryAnalysis } = useQuery({
    queryKey: ['leads', 'territory-analysis', selectedMember],
    queryFn: () => api.get('/leads/territory_analysis/', {
      params: { assigned_user_id: selectedMember }
    }),
    enabled: !!selectedMember
  });

  const renderPerformanceOverview = () => {
    if (!territoryPerformance?.team_performance) return null;

    return (
      <div className="space-y-6">
        {/* Team Averages */}
        {territoryPerformance.team_averages && (
          <Card className="bg-sand border-turquoise/20">
            <CardHeader>
              <CardTitle className="text-lg text-charcoal">Team Performance Overview</CardTitle>
              <CardDescription>Average metrics across all team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-deep-blue">
                    {territoryPerformance.team_averages.avg_leads_per_member}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Leads</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-deep-blue">
                    {territoryPerformance.team_averages.avg_geographic_score?.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Geographic Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-deep-blue">
                    {territoryPerformance.team_averages.avg_lead_score?.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Lead Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-deep-blue">
                    {territoryPerformance.team_averages.avg_qualified_leads}
                  </div>
                  <div className="text-sm text-muted-foreground">Qualified Leads</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green">
                    {territoryPerformance.team_averages.avg_conversion_rate}
                  </div>
                  <div className="text-sm text-muted-foreground">Conversions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Individual Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {territoryPerformance.team_performance.map((member: any, index: number) => (
            <Card 
              key={member.user_id} 
              className={`bg-white border-turquoise/20 hover:border-turquoise/40 transition-colors cursor-pointer ${
                selectedMember === member.user_id ? 'ring-2 ring-turquoise' : ''
              }`}
              onClick={() => setSelectedMember(member.user_id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-charcoal">{member.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    {member.avg_geographic_score >= 80 && (
                      <Badge variant="outline" className="text-green bg-green/10">
                        <Award className="h-3 w-3 mr-1" />
                        Top Performer
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-deep-blue bg-deep-blue/10">
                      {member.total_leads} leads
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Geographic Score:</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <Progress value={member.avg_geographic_score} className="flex-1" />
                        <span className="font-medium text-charcoal w-12">{member.avg_geographic_score?.toFixed(1)}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Lead Score:</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <Progress value={member.avg_lead_score} className="flex-1" />
                        <span className="font-medium text-charcoal w-12">{member.avg_lead_score?.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Lead Statistics */}
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Geographic:</span>
                      <div className="font-medium text-charcoal">{member.geographic_leads}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Qualified:</span>
                      <div className="font-medium text-charcoal">{member.qualified_leads}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Converted:</span>
                      <div className="font-medium text-green">{member.converted_leads}</div>
                    </div>
                  </div>

                  {/* Territory Coverage */}
                  {member.territory_coverage && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Territory Coverage:</span>
                      <div className="text-charcoal">
                        {member.territory_coverage.neighborhoods} neighborhoods, {member.territory_coverage.cities} cities
                      </div>
                    </div>
                  )}

                  {/* Recent Activity */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Recent Activities:</span>
                    <span className="font-medium text-charcoal">{member.recent_activities}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recommendations */}
        {territoryPerformance.recommendations && territoryPerformance.recommendations.length > 0 && (
          <Card className="bg-sand border-orange/20">
            <CardHeader>
              <CardTitle className="text-lg text-charcoal flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange" />
                <span>Performance Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {territoryPerformance.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-orange rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-charcoal">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderWorkloadAnalysis = () => {
    if (!workloadBalance?.workload_analysis) return null;

    return (
      <div className="space-y-6">
        {/* Balance Overview */}
        <Card className="bg-sand border-turquoise/20">
          <CardHeader>
            <CardTitle className="text-lg text-charcoal">Workload Balance Overview</CardTitle>
            <CardDescription>
              Team workload distribution with balance score: {workloadBalance.balance_score}/100
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-deep-blue">{workloadBalance.total_leads}</div>
                <div className="text-sm text-muted-foreground">Total Leads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-deep-blue">{workloadBalance.total_members}</div>
                <div className="text-sm text-muted-foreground">Team Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-deep-blue">{workloadBalance.avg_leads_per_member}</div>
                <div className="text-sm text-muted-foreground">Avg per Member</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${workloadBalance.balance_score >= 80 ? 'text-green' : workloadBalance.balance_score >= 60 ? 'text-orange' : 'text-red-500'}`}>
                  {workloadBalance.balance_score}
                </div>
                <div className="text-sm text-muted-foreground">Balance Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Member Workload Distribution */}
        <Card className="bg-white border-turquoise/20">
          <CardHeader>
            <CardTitle className="text-lg text-charcoal">Workload Distribution</CardTitle>
            <CardDescription>Individual workload vs team average</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workloadBalance.workload_analysis.map((member: any, index: number) => (
                <div key={member.user_id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-charcoal">{member.name}</span>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={`${
                          member.variance_percent > 20 ? 'text-red-500 bg-red-50' :
                          member.variance_percent < -20 ? 'text-blue-500 bg-blue-50' :
                          'text-green bg-green/10'
                        }`}
                      >
                        {member.variance_percent > 0 ? '+' : ''}{member.variance_percent}%
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {member.lead_count} leads
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Progress 
                      value={(member.lead_count / Math.max(...workloadBalance.workload_analysis.map((m: any) => m.lead_count))) * 100} 
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-16">
                      Score: {member.avg_score}
                    </span>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Geographic Coverage: {member.geographic_coverage}% • Geographic Leads: {member.geographic_leads}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Imbalance Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overloaded Members */}
          {workloadBalance.overloaded_members && workloadBalance.overloaded_members.length > 0 && (
            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-lg text-red-700 flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Overloaded Members</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workloadBalance.overloaded_members.map((member: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded border border-red-200">
                      <div>
                        <div className="font-medium text-charcoal">{member.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {member.lead_count} leads ({member.variance_percent}% above average)
                        </div>
                      </div>
                      <Badge className="bg-red-100 text-red-700">
                        +{member.variance_from_average.toFixed(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Underloaded Members */}
          {workloadBalance.underloaded_members && workloadBalance.underloaded_members.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-700 flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Underloaded Members</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workloadBalance.underloaded_members.map((member: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded border border-blue-200">
                      <div>
                        <div className="font-medium text-charcoal">{member.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {member.lead_count} leads ({Math.abs(member.variance_percent)}% below average)
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">
                        {member.variance_from_average.toFixed(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Balancing Recommendations */}
        {workloadBalance.balancing_recommendations && workloadBalance.balancing_recommendations.length > 0 && (
          <Card className="bg-sand border-turquoise/20">
            <CardHeader>
              <CardTitle className="text-lg text-charcoal">Balancing Recommendations</CardTitle>
              <CardDescription>Suggested actions to improve workload balance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workloadBalance.balancing_recommendations.map((rec: any, index: number) => (
                  <div key={index} className="p-4 bg-white rounded-lg border border-turquoise/20">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-charcoal">{rec.member_name}</div>
                        <div className="text-sm text-muted-foreground mb-2">{rec.reason}</div>
                        <div className="text-sm">
                          <span className="text-charcoal">Current: {rec.current_leads} leads</span>
                          <span className="mx-2 text-muted-foreground">→</span>
                          <span className="text-charcoal">Suggested: {rec.suggested_leads} leads</span>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${
                          rec.type === 'redistribute_from' ? 'text-red-600 bg-red-50' : 'text-blue-600 bg-blue-50'
                        }`}
                      >
                        {rec.type === 'redistribute_from' ? 
                          `Reduce by ${rec.leads_to_redistribute}` : 
                          `Add ${rec.leads_to_receive}`
                        }
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderMemberDetail = () => {
    if (!selectedMember || !memberTerritoryAnalysis) return null;

    const analysis = memberTerritoryAnalysis;

    return (
      <div className="space-y-6">
        {/* Member Overview */}
        <Card className="bg-sand border-turquoise/20">
          <CardHeader>
            <CardTitle className="text-lg text-charcoal">Individual Territory Analysis</CardTitle>
            <CardDescription>
              Detailed analysis for selected team member
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-deep-blue">{analysis.total_leads}</div>
                <div className="text-sm text-muted-foreground">Total Leads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-deep-blue">
                  {analysis.coverage_analysis?.neighborhoods_covered || 0}
                </div>
                <div className="text-sm text-muted-foreground">Neighborhoods</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-deep-blue">
                  {analysis.coverage_analysis?.avg_geographic_score?.toFixed(1) || 0}
                </div>
                <div className="text-sm text-muted-foreground">Avg Geo Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green">
                  {analysis.performance_metrics?.conversion_rate || 0}%
                </div>
                <div className="text-sm text-muted-foreground">Conversion Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        {analysis.geographic_distribution && (
          <Card className="bg-white border-turquoise/20">
            <CardHeader>
              <CardTitle className="text-lg text-charcoal">Geographic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Neighborhoods */}
                {analysis.geographic_distribution.top_neighborhoods && (
                  <div>
                    <h4 className="font-semibold text-charcoal mb-3">Top Neighborhoods</h4>
                    <div className="space-y-2">
                      {analysis.geographic_distribution.top_neighborhoods.slice(0, 5).map((neighborhood: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-sand rounded">
                          <span className="text-charcoal">{neighborhood.target_neighborhood__name}</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-deep-blue bg-deep-blue/10">
                              {neighborhood.lead_count} leads
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {neighborhood.avg_score?.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Top Cities */}
                {analysis.geographic_distribution.top_cities && (
                  <div>
                    <h4 className="font-semibold text-charcoal mb-3">Top Cities</h4>
                    <div className="space-y-2">
                      {analysis.geographic_distribution.top_cities.slice(0, 5).map((city: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-sand rounded">
                          <span className="text-charcoal">{city.headquarters_city}</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-deep-blue bg-deep-blue/10">
                              {city.lead_count} leads
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {city.avg_score?.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Coverage Gaps */}
        {analysis.coverage_gaps && (
          <Card className="bg-orange-50 border-orange-200">
            <CardHeader>
              <CardTitle className="text-lg text-orange-700 flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Coverage Gaps & Opportunities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.coverage_gaps.uncovered_neighborhoods && analysis.coverage_gaps.uncovered_neighborhoods.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-charcoal mb-2">Uncovered High-Potential Neighborhoods</h4>
                    <div className="space-y-2">
                      {analysis.coverage_gaps.uncovered_neighborhoods.map((neighborhood: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded border border-orange-200">
                          <div>
                            <div className="font-medium text-charcoal">{neighborhood.target_neighborhood__name}</div>
                            <div className="text-sm text-muted-foreground">
                              {neighborhood.lead_count} available leads
                            </div>
                          </div>
                          <Badge className="bg-orange-100 text-orange-700">
                            Score: {neighborhood.avg_score?.toFixed(1)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.coverage_gaps.high_scoring_uncovered_leads > 0 && (
                  <div className="p-3 bg-white rounded border border-orange-200">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                      <span className="font-medium text-charcoal">
                        {analysis.coverage_gaps.high_scoring_uncovered_leads} high-scoring leads not covered
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Consider expanding territory or optimizing assignments
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-charcoal">Territory Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive territory performance analysis and workload optimization
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
          {selectedMember && (
            <Button 
              variant="outline" 
              onClick={() => setSelectedMember(null)}
              className="text-orange hover:text-orange/80"
            >
              Clear Selection
            </Button>
          )}
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Team Performance</span>
          </TabsTrigger>
          <TabsTrigger value="workload" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Workload Balance</span>
          </TabsTrigger>
          <TabsTrigger value="individual" className="flex items-center space-x-2" disabled={!selectedMember}>
            <MapPin className="h-4 w-4" />
            <span>Individual Analysis</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          {renderPerformanceOverview()}
        </TabsContent>

        <TabsContent value="workload">
          {renderWorkloadAnalysis()}
        </TabsContent>

        <TabsContent value="individual">
          {selectedMember ? renderMemberDetail() : (
            <Card className="bg-sand border-turquoise/20">
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-charcoal mb-2">Select a Team Member</h3>
                <p className="text-muted-foreground">
                  Click on a team member in the Performance tab to view their detailed territory analysis.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}