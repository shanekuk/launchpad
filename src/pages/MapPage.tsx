import { useState } from 'react';
import Map, { NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import OpportunityMarker from '../components/OpportunityMarker';
import { useOpportunities } from '../hooks/useOpportunities';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

// center of downtown LA
const LA_CENTER = { longitude: -118.2437, latitude: 34.0522 };

// rough bounds of LA County,
const LA_BOUNDS: [[number, number], [number, number]] = [
  [-119.2, 33.5], // southwest
  [-117.4, 34.9], // northeast
];

export default function MapPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { opportunities, isLoading, error } = useOpportunities();

  const status = error
    ?? (isLoading ? 'Loading opportunities…' : null)
    ?? (opportunities.length === 0 ? 'No opportunities found' : null);

  if (!MAPBOX_TOKEN) {
    return (
      <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
        Missing <code>VITE_MAPBOX_TOKEN</code>. Copy <code>.env.example</code> to{' '}
        <code>.env</code>, add your Mapbox public token, and restart the dev server.
      </div>
    );
  }

  return (
    <Map
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={{ ...LA_CENTER, zoom: 10 }}
      maxBounds={LA_BOUNDS}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      style={{ width: '100vw', height: '100vh' }}
      onClick={() => setSelectedId(null)}
    >
      <NavigationControl position="top-right" />
      {status && (
        <div
          role={error ? 'alert' : 'status'}
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            padding: '8px 12px',
            borderRadius: 6,
            background: error ? '#fee2e2' : 'white',
            color: error ? '#991b1b' : '#334155',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            fontFamily: 'system-ui, sans-serif',
            fontSize: 14,
          }}
        >
          {status}
        </div>
      )}
      {opportunities.map((opportunity) => (
        <OpportunityMarker
          key={opportunity.id}
          opportunity={opportunity}
          isSelected={opportunity.id === selectedId}
          onSelect={setSelectedId}
        />
      ))}
    </Map>
  );
}
