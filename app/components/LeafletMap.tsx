'use client';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix marker icon issue in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

function LocationPicker({ onSelect }: { onSelect: (latlng: any) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
}

export default function LeafletMap({
  coordinates,
  setCoordinates,
}: {
  coordinates: string;
  setCoordinates: (coords: string) => void;
}) {
  const [marker, setMarker] = useState<[number, number] | null>(null);

  const handleMapClick = (latlng: any) => {
    const { lat, lng } = latlng;
    const coords = `${lat},${lng}`;
    setCoordinates(coords);
    setMarker([lat, lng]);
  };

  return (
    <div className="mb-3">
      <label className="form-label">Select Location on Map</label>
      <MapContainer
        center={[10.3157, 123.8854]}
        zoom={13}
        style={{ height: '200px', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationPicker onSelect={handleMapClick} />
        {marker && <Marker position={marker}></Marker>}
      </MapContainer>

      <input
        type="text"
        className="form-control mt-2"
        value={coordinates}
        readOnly
      />
    </div>
  );
}
