'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, TrendingUp, Users, Target, ExternalLink, Star } from 'lucide-react';
import { api } from "@/lib/platform-api";

interface LocationRecommendationsProps {
  selectedLocation: {lat: number, lng: number} | null;
  filterCriteria: any;
}

export function LocationRecommendations({ selectedLocation, filterCriteria }: LocationRecommendationsProps) {
  const [recommendationType, setRecommendationType] = useState<'nearby' | 'optimal' | 'market'>('nearby');

  // Fetch location-based recommendations
  const { data: nearbyRecommendations, isLoading: nearbyLoading } = useQuery({
    queryKey: ['leads', 'location-recommendations', selectedLocation],
    queryFn: () => {
      if (!selectedLocation) return null;
      return api.get('/leads/location_recommendations/', {
        params: {
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
          radius_km: 10,
          limit: 20
        }
      });
    },
    enabled: !!selectedLocation && recommendationType === 'nearby'
  });

  // Fetch optimal territory recommendations
  const { data: optimalRecommendations, isLoading: optimalLoading } = useQuery({
    queryKey: ['leads', 'optimal-assignments'],
    queryFn: () => api.post('/leads/optimize_assignments/', {
      criteria: {
        workload_balance: true,
        geographic_proximity: true,
        ...filterCriteria
      }
    }),
    enabled: recommendationType === 'optimal'
  });

  // Fetch market intelligence recommendations
  const { data: marketRecommendations, isLoading: marketLoading } = useQuery({
    queryKey: ['market-intelligence', 'location-targets', selectedLocation],
    queryFn: () => {
      if (!selectedLocation) return null;
      return api.get('/market-intelligence/targets/', {
        params: {
          near_latitude: selectedLocation.lat,
          near_longitude: selectedLocation.lng,
          radius_km: 15,
          min_score: 70,
          limit: 15
        }
      });
    },
    enabled: !!selectedLocation && recommendationType === 'market'
  });

  const getCurrentData = () => {
    switch (recommendationType) {
      case 'nearby':
        return { data: nearbyRecommendations, loading: nearbyLoading };
      case 'optimal':
        return { data: optimalRecommendations, loading: optimalLoading };
      case 'market':
        return { data: marketRecommendations, loading: marketLoading };
      default:
        return { data: null, loading: false };
    }
  };

  const { data: currentData, loading: currentLoading } = getCurrentData();

  const renderNearbyRecommendations = () => {
    if (!nearbyRecommendations?.results) return null;

    return (
      <div className="space-y-4">
        {nearbyRecommendations.results.map((lead: any, index: number) => (
          <Card key={lead.id} className="bg-white border-turquoise/20 hover:border-turquoise/40 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-charcoal">{lead.company_name}</h4>
                    <Badge variant="outline" className="text-deep-blue bg-deep-blue/10">
                      Score: {lead.current_score}
                    </Badge>
                    {lead.geographic_score >= 80 && (
                      <Badge variant="outline" className="text-green bg-green/10">
                        <Star className="h-3 w-3 mr-1" />
                        High Geographic
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{lead.headquarters_city}, {lead.headquarters_country}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="h-4 w-4" />
                      <span>{lead.distance_km?.toFixed(1)}km away</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Geographic:</span>
                      <span className="ml-1 font-medium text-charcoal">{lead.geographic_score || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Accessibility:</span>
                      <span className="ml-1 font-medium text-charcoal">{lead.accessibility_score || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">University:</span>
                      <span className="ml-1 font-medium text-charcoal">{lead.university_proximity_score || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <span className="ml-1 font-medium text-charcoal">{lead.status}</span>
                    </div>
                  </div>

                  {lead.target_neighborhood && (
                    <div className="mt-2 text-sm">
                      <span className="text-muted-foreground">Neighborhood:</span>
                      <span className="ml-1 text-charcoal">{lead.target_neighborhood.name}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2">
                  <Button size="sm" variant="outline" className="text-deep-blue border-deep-blue hover:bg-deep-blue/10">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  {!lead.assigned_to && (
                    <Button size="sm" className="bg-turquoise hover:bg-turquoise/90">
                      Assign Lead
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderOptimalRecommendations = () => {
    if (!optimalRecommendations?.recommended_assignments) return null;

    return (
      <div className="space-y-6">
        {/* Assignment Impact Summary */}
        {optimalRecommendations.assignment_impact && (
          <Card className="bg-sand border-turquoise/20">
            <CardHeader>
              <CardTitle className="text-lg text-charcoal">Assignment Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Assignments:</span>
                  <div className="text-2xl font-bold text-deep-blue">
                    {optimalRecommendations.assignment_impact.total_assignments}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Team Members:</span>
                  <div className="text-2xl font-bold text-deep-blue">
                    {optimalRecommendations.assignment_impact.affected_team_members}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Avg Workload:</span>
                  <div className="text-2xl font-bold text-deep-blue">
                    {optimalRecommendations.assignment_impact.avg_workload_after}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Optimization Score:</span>
                  <div className="text-2xl font-bold text-green">
                    {optimalRecommendations.optimization_score}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Assignment Recommendations */}
        <div className="space-y-4">
          {optimalRecommendations.recommended_assignments.map((recommendation: any, index: number) => (
            <Card key={index} className="bg-white border-turquoise/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-charcoal">{recommendation.assigned_to_name}</CardTitle>
                  <Badge variant="outline" className="text-deep-blue bg-deep-blue/10">
                    {recommendation.lead_count} leads • Score: {recommendation.avg_match_score?.toFixed(1)}
                  </Badge>
                </div>
                <CardDescription>{recommendation.recommendation}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendation.assignments.slice(0, 3).map((assignment: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-sand rounded-lg">
                      <div>
                        <div className="font-medium text-charcoal">{assignment.company_name}</div>
                        <div className="text-sm text-muted-foreground">{assignment.reason}</div>
                      </div>
                      <Badge variant="outline" className="text-green bg-green/10">
                        Match: {assignment.match_score}
                      </Badge>
                    </div>
                  ))}
                  {recommendation.assignments.length > 3 && (
                    <div className="text-sm text-muted-foreground text-center">
                      +{recommendation.assignments.length - 3} more assignments...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderMarketRecommendations = () => {
    if (!marketRecommendations?.results) return null;

    return (
      <div className="space-y-4">
        {marketRecommendations.results.map((target: any, index: number) => (
          <Card key={target.id} className="bg-white border-turquoise/20 hover:border-turquoise/40 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-charcoal">{target.company_name}</h4>
                    <Badge variant="outline" className="text-deep-blue bg-deep-blue/10">
                      Intelligence Score: {target.intelligence_score}
                    </Badge>
                    {target.discovery_score >= 85 && (
                      <Badge variant="outline" className="text-green bg-green/10">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        High Discovery
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{target.location_city}, {target.location_country}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{target.sector || 'Unknown sector'}</span>
                    </div>
                  </div>

                  {target.business_model && (
                    <div className="text-sm mb-3">
                      <span className="text-muted-foreground">Business Model:</span>
                      <span className="ml-1 text-charcoal">{target.business_model}</span>
                    </div>
                  )}

                  {target.discovery_source && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Discovered via:</span>
                      <span className="ml-1 text-charcoal">{target.discovery_source}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2">
                  <Button size="sm" variant="outline" className="text-deep-blue border-deep-blue hover:bg-deep-blue/10">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Target
                  </Button>
                  <Button size="sm" className="bg-turquoise hover:bg-turquoise/90">
                    Create Lead
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">Location Recommendations</h2>
        <p className="text-muted-foreground">
          {selectedLocation 
            ? `Recommendations for location ${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`
            : "Select a location on the map to get targeted recommendations"
          }
        </p>
      </div>

      {/* Recommendation Type Selector */}
      <div className="flex items-center space-x-2">
        <Button
          variant={recommendationType === 'nearby' ? 'default' : 'outline'}
          onClick={() => setRecommendationType('nearby')}
          className="flex items-center space-x-2"
          disabled={!selectedLocation}
        >
          <MapPin className="h-4 w-4" />
          <span>Nearby Leads</span>
        </Button>
        <Button
          variant={recommendationType === 'optimal' ? 'default' : 'outline'}
          onClick={() => setRecommendationType('optimal')}
          className="flex items-center space-x-2"
        >
          <Target className="h-4 w-4" />
          <span>Optimal Assignments</span>
        </Button>
        <Button
          variant={recommendationType === 'market' ? 'default' : 'outline'}
          onClick={() => setRecommendationType('market')}
          className="flex items-center space-x-2"
          disabled={!selectedLocation}
        >
          <TrendingUp className="h-4 w-4" />
          <span>Market Targets</span>
        </Button>
      </div>

      <Separator />

      {/* Content */}
      {currentLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deep-blue mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading recommendations...</p>
          </div>
        </div>
      ) : !selectedLocation && (recommendationType === 'nearby' || recommendationType === 'market') ? (
        <Card className="bg-sand border-turquoise/20">
          <CardContent className="p-8 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-charcoal mb-2">Select a Location</h3>
            <p className="text-muted-foreground">
              Click on the map or use the filters to select a location for targeted recommendations.
            </p>
          </CardContent>
        </Card>
      ) : currentData ? (
        <div>
          {recommendationType === 'nearby' && renderNearbyRecommendations()}
          {recommendationType === 'optimal' && renderOptimalRecommendations()}
          {recommendationType === 'market' && renderMarketRecommendations()}
        </div>
      ) : (
        <Card className="bg-sand border-turquoise/20">
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              No recommendations available for the selected criteria.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}