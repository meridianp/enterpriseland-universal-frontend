'use client';

import { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, School, Navigation } from 'lucide-react';
import type { SchemeLocationInformation, TargetUniversity } from '@/lib/types/scheme.types';

interface SchemeLocationMapProps {
  location: SchemeLocationInformation;
  universities?: TargetUniversity[];
}

export function SchemeLocationMap({ location, universities = [] }: SchemeLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // In a real implementation, you would initialize a map library here
    // For example: Mapbox, Google Maps, or Leaflet
    // This is a placeholder for the map implementation
    
    if (!location.latitude || !location.longitude) return;

    // Example with Leaflet (you would need to install and import it):
    /*
    const map = L.map(mapRef.current).setView([location.latitude, location.longitude], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add scheme marker
    L.marker([location.latitude, location.longitude])
      .addTo(map)
      .bindPopup(`<b>${location.address}</b><br>${location.city}, ${location.country}`);

    // Add university markers
    universities.forEach((uni) => {
      // You would need coordinates for each university
      // This is just an example
    });

    return () => {
      map.remove();
    };
    */
  }, [location, universities]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location Map
        </CardTitle>
        <CardDescription>
          Scheme location and nearby universities
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Map Container */}
        <div 
          ref={mapRef}
          className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center relative overflow-hidden"
        >
          {/* Placeholder Map UI */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <MapPin className="h-12 w-12 text-blue-600 mx-auto" />
                <div>
                  <p className="font-medium text-lg">{location.city}, {location.country}</p>
                  <p className="text-sm text-muted-foreground">{location.address}</p>
                  {location.latitude && location.longitude && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* University Indicators */}
            {universities.length > 0 && (
              <div className="absolute top-4 right-4 space-y-2">
                <Badge variant="secondary" className="bg-white/90">
                  <School className="h-3 w-3 mr-1" />
                  {universities.length} Universities
                </Badge>
              </div>
            )}

            {/* Transport Indicators */}
            {location.nearest_train_station && (
              <div className="absolute bottom-4 left-4">
                <Badge variant="secondary" className="bg-white/90">
                  <Navigation className="h-3 w-3 mr-1" />
                  {location.nearest_train_station}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Map Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full" />
            <span>Scheme Location</span>
          </div>
          {universities.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded-full" />
              <span>Universities</span>
            </div>
          )}
          {location.nearest_train_station && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-600 rounded-full" />
              <span>Transport Links</span>
            </div>
          )}
        </div>

        {/* Coordinates Info */}
        {(!location.latitude || !location.longitude) && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Map coordinates not available. Add latitude and longitude to display the interactive map.
            </p>
          </div>
        )}

        {/* Integration Note */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This is a placeholder for the map component. 
            In production, integrate with a mapping service like Mapbox, Google Maps, or Leaflet.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}