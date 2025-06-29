'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { MapPin, Search, TrendingUp, Users, Building2, GraduationCap, Star, Filter } from 'lucide-react';
import { api } from "@/lib/platform-api";

interface NeighborhoodScoringProps {
  geographicAnalytics: any;
  selectedLocation: {lat: number, lng: number} | null;
}

export function NeighborhoodScoring({ geographicAnalytics, selectedLocation }: NeighborhoodScoringProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'leads' | 'name'>('score');
  const [filterMinScore, setFilterMinScore] = useState<number>(0);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);

  // Fetch neighborhood data
  const { data: neighborhoods, isLoading: neighborhoodsLoading } = useQuery({
    queryKey: ['geographic-intelligence', 'neighborhoods'],
    queryFn: () => api.get('/geographic-intelligence/neighborhoods/'),
  });

  // Fetch neighborhood details for selected neighborhood
  const { data: neighborhoodDetails } = useQuery({
    queryKey: ['geographic-intelligence', 'neighborhoods', selectedNeighborhood],
    queryFn: () => api.get(`/geographic-intelligence/neighborhoods/${selectedNeighborhood}/`),
    enabled: !!selectedNeighborhood
  });

  // Fetch leads for selected neighborhood
  const { data: neighborhoodLeads } = useQuery({
    queryKey: ['leads', 'by-neighborhood', selectedNeighborhood],
    queryFn: () => api.get('/leads/leads/', {
      params: { target_neighborhood: selectedNeighborhood, page_size: 100 }
    }),
    enabled: !!selectedNeighborhood
  });

  // Fetch nearby neighborhoods if location is selected
  const { data: nearbyNeighborhoods } = useQuery({
    queryKey: ['geographic-intelligence', 'neighborhoods', 'nearby', selectedLocation],
    queryFn: () => {
      if (!selectedLocation) return null;
      return api.get('/geographic-intelligence/neighborhoods/', {
        params: {
          near_latitude: selectedLocation.lat,
          near_longitude: selectedLocation.lng,
          radius_km: 10
        }
      });
    },
    enabled: !!selectedLocation
  });

  const filteredNeighborhoods = neighborhoods?.results?.filter((neighborhood: any) => {
    const matchesSearch = !searchTerm || 
      neighborhood.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      neighborhood.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesScore = (neighborhood.overall_score || 0) >= filterMinScore;
    
    return matchesSearch && matchesScore;
  }).sort((a: any, b: any) => {
    switch (sortBy) {
      case 'score':
        return (b.overall_score || 0) - (a.overall_score || 0);
      case 'leads':
        return (b.lead_count || 0) - (a.lead_count || 0);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green bg-green/10';
    if (score >= 70) return 'text-deep-blue bg-deep-blue/10';
    if (score >= 50) return 'text-orange bg-orange/10';
    return 'text-red-500 bg-red-50';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  const renderNeighborhoodList = () => {
    if (neighborhoodsLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deep-blue mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading neighborhoods...</p>
          </div>
        </div>
      );
    }

    if (!filteredNeighborhoods || filteredNeighborhoods.length === 0) {
      return (
        <Card className="bg-sand border-turquoise/20">
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-charcoal mb-2">No Neighborhoods Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters.
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredNeighborhoods.map((neighborhood: any) => (
          <Card 
            key={neighborhood.id} 
            className={`bg-white border-turquoise/20 hover:border-turquoise/40 transition-colors cursor-pointer ${
              selectedNeighborhood === neighborhood.id ? 'ring-2 ring-turquoise' : ''
            }`}
            onClick={() => setSelectedNeighborhood(neighborhood.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-charcoal">{neighborhood.name}</CardTitle>
                  <CardDescription className="flex items-center space-x-1 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{neighborhood.city}, {neighborhood.country}</span>
                  </CardDescription>
                </div>
                <Badge className={getScoreColor(neighborhood.overall_score || 0)}>
                  {neighborhood.overall_score?.toFixed(1) || 'N/A'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Overall Score */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Overall Score</span>
                    <span className="font-medium">{getScoreLabel(neighborhood.overall_score || 0)}</span>
                  </div>
                  <Progress value={neighborhood.overall_score || 0} className="h-2" />
                </div>

                {/* Score Components */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Accessibility:</span>
                    <div className="font-medium text-charcoal">{neighborhood.accessibility_score?.toFixed(1) || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">University:</span>
                    <div className="font-medium text-charcoal">{neighborhood.university_proximity_score?.toFixed(1) || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Market:</span>
                    <div className="font-medium text-charcoal">{neighborhood.market_demand_score?.toFixed(1) || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Competition:</span>
                    <div className="font-medium text-charcoal">{neighborhood.competition_score?.toFixed(1) || 'N/A'}</div>
                  </div>
                </div>

                {/* Lead Count */}
                {neighborhood.lead_count > 0 && (
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-sm text-muted-foreground">Active Leads:</span>
                    <Badge variant="outline" className="text-deep-blue bg-deep-blue/10">
                      {neighborhood.lead_count}
                    </Badge>
                  </div>
                )}

                {/* Universities Count */}
                {neighborhood.universities_count > 0 && (
                  <div className="flex items-center space-x-2 text-sm">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{neighborhood.universities_count} universities nearby</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderNeighborhoodDetails = () => {
    if (!selectedNeighborhood || !neighborhoodDetails) return null;

    const details = neighborhoodDetails;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-charcoal">{details.name}</h3>
            <p className="text-muted-foreground">{details.city}, {details.country}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setSelectedNeighborhood(null)}
            className="text-orange hover:text-orange/80"
          >
            Close Details
          </Button>
        </div>

        {/* Score Breakdown */}
        <Card className="bg-sand border-turquoise/20">
          <CardHeader>
            <CardTitle className="text-lg text-charcoal">Scoring Breakdown</CardTitle>
            <CardDescription>Detailed analysis of neighborhood factors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-charcoal">Overall Score</span>
                    <Badge className={getScoreColor(details.overall_score || 0)}>
                      {details.overall_score?.toFixed(1) || 'N/A'}
                    </Badge>
                  </div>
                  <Progress value={details.overall_score || 0} className="h-3" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-charcoal">Accessibility Score</span>
                    <span className="text-sm text-muted-foreground">{details.accessibility_score?.toFixed(1) || 'N/A'}</span>
                  </div>
                  <Progress value={details.accessibility_score || 0} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-charcoal">University Proximity</span>
                    <span className="text-sm text-muted-foreground">{details.university_proximity_score?.toFixed(1) || 'N/A'}</span>
                  </div>
                  <Progress value={details.university_proximity_score || 0} className="h-2" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-charcoal">Market Demand</span>
                    <span className="text-sm text-muted-foreground">{details.market_demand_score?.toFixed(1) || 'N/A'}</span>
                  </div>
                  <Progress value={details.market_demand_score || 0} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-charcoal">Competition Score</span>
                    <span className="text-sm text-muted-foreground">{details.competition_score?.toFixed(1) || 'N/A'}</span>
                  </div>
                  <Progress value={details.competition_score || 0} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-charcoal">Investment Appeal</span>
                    <span className="text-sm text-muted-foreground">{details.investment_appeal_score?.toFixed(1) || 'N/A'}</span>
                  </div>
                  <Progress value={details.investment_appeal_score || 0} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leads in Neighborhood */}
        {neighborhoodLeads?.results && neighborhoodLeads.results.length > 0 && (
          <Card className="bg-white border-turquoise/20">
            <CardHeader>
              <CardTitle className="text-lg text-charcoal flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Leads in {details.name}</span>
              </CardTitle>
              <CardDescription>{neighborhoodLeads.results.length} active leads in this neighborhood</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {neighborhoodLeads.results.slice(0, 5).map((lead: any) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 bg-sand rounded-lg">
                    <div>
                      <div className="font-medium text-charcoal">{lead.company_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {lead.headquarters_city} • Status: {lead.status}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-deep-blue bg-deep-blue/10">
                        Score: {lead.current_score}
                      </Badge>
                      {lead.geographic_score >= 80 && (
                        <Badge variant="outline" className="text-green bg-green/10">
                          <Star className="h-3 w-3 mr-1" />
                          High Geo
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {neighborhoodLeads.results.length > 5 && (
                  <div className="text-sm text-muted-foreground text-center pt-2">
                    +{neighborhoodLeads.results.length - 5} more leads...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location Info */}
        {details.location && (
          <Card className="bg-white border-turquoise/20">
            <CardHeader>
              <CardTitle className="text-lg text-charcoal">Location Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Coordinates:</span>
                  <div className="text-charcoal font-mono">
                    {details.location.coordinates[1].toFixed(6)}, {details.location.coordinates[0].toFixed(6)}
                  </div>
                </div>
                {details.population && (
                  <div>
                    <span className="text-muted-foreground">Population:</span>
                    <div className="text-charcoal">{details.population.toLocaleString()}</div>
                  </div>
                )}
                {details.area_km2 && (
                  <div>
                    <span className="text-muted-foreground">Area:</span>
                    <div className="text-charcoal">{details.area_km2} km²</div>
                  </div>
                )}
                {details.housing_cost_index && (
                  <div>
                    <span className="text-muted-foreground">Housing Cost Index:</span>
                    <div className="text-charcoal">{details.housing_cost_index}</div>
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
      <div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">Neighborhood Scoring</h2>
        <p className="text-muted-foreground">
          Comprehensive analysis of neighborhoods based on investment potential and geographic intelligence
        </p>
      </div>

      {selectedNeighborhood ? (
        renderNeighborhoodDetails()
      ) : (
        <>
          {/* Filters and Search */}
          <Card className="bg-sand border-turquoise/20">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search neighborhoods..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Min Score:</span>
                    <Select value={filterMinScore.toString()} onValueChange={(v) => setFilterMinScore(Number(v))}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="70">70</SelectItem>
                        <SelectItem value="85">85</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Sort by:</span>
                    <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="score">Score</SelectItem>
                        <SelectItem value="leads">Leads</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nearby Neighborhoods (if location selected) */}
          {selectedLocation && nearbyNeighborhoods?.results && nearbyNeighborhoods.results.length > 0 && (
            <Card className="bg-turquoise/5 border-turquoise/20">
              <CardHeader>
                <CardTitle className="text-lg text-charcoal flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Nearby Neighborhoods</span>
                </CardTitle>
                <CardDescription>
                  Neighborhoods within 10km of selected location ({selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {nearbyNeighborhoods.results.slice(0, 6).map((neighborhood: any) => (
                    <div 
                      key={neighborhood.id}
                      className="p-3 bg-white rounded-lg border border-turquoise/20 hover:border-turquoise/40 cursor-pointer transition-colors"
                      onClick={() => setSelectedNeighborhood(neighborhood.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-charcoal">{neighborhood.name}</div>
                        <Badge className={getScoreColor(neighborhood.overall_score || 0)}>
                          {neighborhood.overall_score?.toFixed(1) || 'N/A'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {neighborhood.distance_km?.toFixed(1)}km away
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Neighborhood List */}
          {renderNeighborhoodList()}
        </>
      )}
    </div>
  );
}