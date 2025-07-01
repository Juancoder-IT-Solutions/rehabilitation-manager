'use client';

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '250px',
};

const fallbackCenter = {
  lat: 10.3157,   // Cebu City as fallback center
  lng: 123.8854,
};

export default function GoogleMapComponent({
  coordinates,
  setCoordinates,
}: {
  coordinates: string;
  setCoordinates: (coords: string) => void;
}) {
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState(fallbackCenter);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  // Get user's current location on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMapCenter({ lat, lng });
          setMarker({ lat, lng });
          setCoordinates(`${lat},${lng}`);
        },
        () => {
          console.warn("Geolocation denied. Using fallback location.");
        }
      );
    }
  }, []);

  // Handle click on the map to move the marker
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarker({ lat, lng });
      setCoordinates(`${lat},${lng}`);
    }
  };

  // Handle dragging the marker to new location
  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarker({ lat, lng });
      setCoordinates(`${lat},${lng}`);
    }
  };

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={marker || mapCenter}
        zoom={15}
        onClick={handleMapClick}
      >
        {marker && (
          <Marker
            position={marker}
            draggable={true}
            onDragEnd={handleMarkerDragEnd}
          />
        )}
      </GoogleMap>

      <input
        type="text"
        className="form-control mt-2"
        value={coordinates}
        readOnly
      />
    </>
  );
}
