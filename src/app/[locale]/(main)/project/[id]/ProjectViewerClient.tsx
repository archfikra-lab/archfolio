'use client';

import { useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { downloadCaseStudyAction } from '@/app/actions/download';

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

export default function ProjectViewerClient({ project, isLoggedIn = false }: { project: Project, isLoggedIn?: boolean }) {
    const [activeType, setActiveType] = useState<DisciplineType>("Architectural");
    const [isDownloading, setIsDownloading] = useState(false);
    const router = useRouter();

    const handleDownload = async () => {
        setIsDownloading(true);
        const result = await downloadCaseStudyAction(project.id);
        setIsDownloading(false);
        if (result.success) {
            let message = "Download initiated! You have used 1 download credit.";
            if (result.features) {
                const restrictions = [];
                if (!result.features.canDownloadHighRes) restrictions.push("High-Res Images");
                if (!result.features.canDownloadCad) restrictions.push("CAD Drafts (DXF/DWG)");
                if (!result.features.canDownloadBim) restrictions.push("BIM Geometries (Revit)");

                if (restrictions.length > 0) {
                    message += `\n\nNote: Your current plan restricts access to the following formats which have been removed from your download payload: ${restrictions.join(', ')}.`;
                }
            }
            alert(message);
        } else {
            if (result.requiresUpgrade) {
                if (confirm(result.error + " Would you like to view our upgrade plans?")) {
                    router.push('/en/pricing');
                }
            } else {
                alert(result.error);
            }
        }
    };

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

                        <div className="mt-8 pt-8 border-t border-[var(--ink-line)]">
                            <h3 className="text-xl font-bold text-[var(--deep-teal)] mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[var(--mustard-gold)]">download</span>
                                Case Study Documents
                            </h3>
                            {isLoggedIn ? (
                                <button onClick={handleDownload} disabled={isDownloading} className="w-full bg-[var(--deep-teal)] text-white px-6 py-4 font-bold uppercase tracking-widest text-xs hover:bg-[var(--mustard-gold)] transition-colors flex items-center justify-center gap-3 shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50">
                                    <span className="material-symbols-outlined">{isDownloading ? 'hourglass_empty' : 'file_download'}</span>
                                    {isDownloading ? 'Processing...' : 'Download Full Case Study Data'}
                                </button>
                            ) : (
                                <div className="bg-[var(--platinum-sheen)]/20 border border-[var(--mustard-gold)]/50 p-6 text-center">
                                    <span className="material-symbols-outlined text-4xl text-[var(--mustard-gold)] mb-3">lock</span>
                                    <h4 className="font-bold text-[var(--deep-teal)] mb-2 uppercase tracking-wide">Registration Required</h4>
                                    <p className="text-sm text-[var(--paper-plane-grey)] mb-6">You must be logged in to download the full case study documents, models, and comprehensive PDF analytics.</p>
                                    <div className="flex justify-center gap-4 max-w-sm mx-auto">
                                        <button onClick={() => router.push('/en/pricing')} className="text-[10px] flex-1 text-center font-bold uppercase tracking-widest bg-[var(--mustard-gold)] text-white px-6 py-3 hover:bg-[var(--deep-teal)] transition-colors">View Plans</button>
                                        <button onClick={() => router.push('/en/login')} className="text-[10px] flex-1 text-center font-bold uppercase tracking-widest border border-[var(--deep-teal)] text-[var(--deep-teal)] px-6 py-3 hover:bg-[var(--platinum-sheen)] hover:border-[var(--platinum-sheen)] transition-all">Sign In</button>
                                    </div>
                                </div>
                            )}
                        </div>
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
