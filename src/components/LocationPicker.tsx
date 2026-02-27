'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Next.js/Webpack
const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

type LocationPickerProps = {
    onChange: (lat: number, lng: number) => void;
    defaultPosition?: [number, number];
};

function LocationMarker({ position, setPosition, onChange }: {
    position: L.LatLng | null,
    setPosition: (pos: L.LatLng) => void,
    onChange: (lat: number, lng: number) => void
}) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onChange(e.latlng.lat, e.latlng.lng);
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={icon}></Marker>
    );
}

export default function LocationPicker({ onChange, defaultPosition }: LocationPickerProps) {
    const [position, setPosition] = useState<L.LatLng | null>(
        defaultPosition ? new L.LatLng(defaultPosition[0], defaultPosition[1]) : null
    );

    // Default to a central global location if none provided (e.g., Cairo, Egypt as an example center)
    const center: [number, number] = defaultPosition || [30.0444, 31.2357];

    return (
        <div className="h-[400px] w-full rounded-md overflow-hidden border border-[var(--ink-line)] z-0 relative">
            <MapContainer
                center={center}
                zoom={defaultPosition ? 13 : 4}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={setPosition} onChange={onChange} />
            </MapContainer>
        </div>
    );
}
