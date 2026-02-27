'use client';

import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Link from 'next/link';

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

type Project = {
    id: string;
    title: string;
    location: string;
    typology: string;
    latitude: number | null;
    longitude: number | null;
    shortDescription: string | null;
    architecturalStyle: string | null;
};

type ProjectMapProps = {
    projects: Project[];
};

export default function ProjectMap({ projects }: ProjectMapProps) {
    const validProjects = useMemo(() => {
        return projects.filter(p => p.latitude !== null && p.longitude !== null) as (Project & { latitude: number, longitude: number })[];
    }, [projects]);

    // Center map on Jordan by default or the first project
    const center: [number, number] = validProjects.length > 0
        ? [validProjects[0].latitude, validProjects[0].longitude]
        : [31.9522, 35.2332]; // Amman

    return (
        <div className="h-[600px] w-full rounded-md overflow-hidden border border-[var(--ink-line)] z-0 relative">
            <MapContainer
                center={center}
                zoom={7}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {validProjects.map((project) => (
                    <Marker
                        key={project.id}
                        position={[project.latitude, project.longitude]}
                        icon={icon}
                    >
                        <Popup>
                            <div className="font-poppins text-[var(--deep-teal)]">
                                <h3 className="font-bold text-lg mb-1">{project.title}</h3>
                                <p className="text-sm italic mb-2">{project.typology} • {project.location}</p>
                                {project.shortDescription && (
                                    <p className="text-xs mb-3 line-clamp-2">{project.shortDescription}</p>
                                )}
                                <Link href={`/project/${project.id}`} className="text-xs font-bold underline hover:text-[var(--bright-rust)] transition-colors">
                                    View Project Details →
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
