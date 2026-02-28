'use client';

import { useState } from 'react';
import Script from 'next/script';

type DisciplineType = "Architectural" | "Structural" | "MEP";

interface Discipline {
    type: string;
    contentJson: string;
    fileUrl: string | null;
}

interface Project {
    id: string;
    title: string;
    location: string;
    year: number;
    shortDescription: string | null;
    disciplines: Discipline[];
}

const ModelViewer = 'model-viewer' as any;

export default function ProjectViewerClient({ project }: { project: Project }) {
    const [activeType, setActiveType] = useState<DisciplineType>("Architectural");

    const disciplines = project.disciplines || [];
    const activeDiscipline = disciplines.find(d => d.type === activeType);

    let parsedContent = null;
    if (activeDiscipline) {
        try {
            parsedContent = JSON.parse(activeDiscipline.contentJson);
        } catch (e) {
            console.error(e);
            parsedContent = { raw: activeDiscipline.contentJson };
        }
    }

    const renderSpecs = (obj: any) => {
        if (!obj || Object.keys(obj).length === 0) {
            return <div className="text-[var(--paper-plane-grey)] py-8 font-mono text-sm">No specifications extracted for this dataset.</div>;
        }

        if (typeof obj !== 'object') {
            return <div className="py-4 text-[var(--deep-teal)]">{String(obj)}</div>;
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(obj).map(([key, value], i) => (
                    <div key={i} className="bg-[var(--platinum-sheen)]/10 p-4 border-l-2 border-[var(--electric-teal)]">
                        <div className="text-[10px] font-bold text-[var(--paper-plane-grey)] uppercase tracking-widest mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                        <div className="text-sm font-bold text-[var(--deep-teal)] break-words">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Assuming fileUrl stores the GLTF model link if applicable. 
    // For demo purposes, we will fallback to a default sample GLTF file if none is present for Architectural.
    const is3DModelAvailable = activeType === 'Architectural';
    const modelUrl = activeDiscipline?.fileUrl || (is3DModelAvailable ? "https://modelviewer.dev/shared-assets/models/Astronaut.glb" : null);

    return (
        <div className="space-y-8">
            {/* Project Overview Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-y border-[var(--ink-line)] py-6">
                <div>
                    <h3 className="text-[10px] font-bold text-[var(--paper-plane-grey)] uppercase tracking-widest mb-1">Location</h3>
                    <p className="font-bold text-[var(--deep-teal)] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">map</span>
                        {project.location}
                    </p>
                </div>
                <div>
                    <h3 className="text-[10px] font-bold text-[var(--paper-plane-grey)] uppercase tracking-widest mb-1">Established</h3>
                    <p className="font-bold text-[var(--deep-teal)]">{project.year || 'N/A'}</p>
                </div>
            </div>

            {project.shortDescription && (
                <div className="bg-[var(--card-bg)] p-6 border border-[var(--ink-line)] border-l-4 border-l-[var(--deep-teal)] text-[var(--deep-teal)] leading-relaxed">
                    {project.shortDescription}
                </div>
            )}

            {/* Discipline Toggles */}
            <div className="flex items-center gap-2 border-b border-[var(--ink-line)]">
                {['Architectural', 'Structural', 'MEP'].map((type) => (
                    <button
                        key={type}
                        className={`px-6 py-3 font-bold uppercase tracking-widest text-xs transition-colors border-b-2 ${activeType === type
                            ? 'border-[var(--electric-teal)] text-[var(--deep-teal)] bg-[var(--platinum-sheen)]/5'
                            : 'border-transparent text-[var(--paper-plane-grey)] hover:text-[var(--deep-teal)]'
                            }`}
                        onClick={() => setActiveType(type as DisciplineType)}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* 3D Viewer & Media Gallery block */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="order-2 lg:order-1 space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--deep-teal)] mb-4">{activeType} Specifications</h2>
                        {renderSpecs(parsedContent)}
                    </div>
                </div>

                <div className="order-1 lg:order-2">
                    <div className="bg-[var(--platinum-sheen)] border border-[var(--ink-line)] aspect-video relative flex flex-col items-center justify-center overflow-hidden group">
                        {/* 3D Viewer */}
                        {modelUrl ? (
                            <>
                                <Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js" />
                                <ModelViewer
                                    src={modelUrl}
                                    ar
                                    auto-rotate
                                    camera-controls
                                    shadow-intensity="1"
                                    style={{ width: '100%', height: '100%', backgroundColor: 'var(--platinum-sheen)' }}
                                    class="z-10"
                                ></ModelViewer>
                                <div className="absolute top-4 right-4 z-20 pointer-events-none">
                                    <span className="bg-white/90 text-black px-3 py-1 text-[9px] font-bold uppercase tracking-widest shadow-sm flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[12px]">3d_rotation</span>
                                        Interactive 3D View
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className="text-[var(--paper-plane-grey)] text-center p-8">
                                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">deployed_code</span>
                                <p className="text-sm font-bold uppercase tracking-widest">No 3D Model Available</p>
                                <p className="text-xs mt-2">Upload a .glb or .gltf file to enable the viewer for this discipline layer.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
