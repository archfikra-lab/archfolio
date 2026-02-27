'use client';

import { useState } from 'react';

type DisciplineType = "Architectural" | "Structural" | "MEP";

interface Discipline {
    type: string;
    contentJson: string;
}

interface Project {
    id: string;
    title: string;
    location: string;
    typology: string;
    year: number;
    fikraVerificationStatus: string;
    disciplines: Discipline[];
}

export default function ProjectViewer({ project }: { project: Project }) {
    const [activeType, setActiveType] = useState<DisciplineType>("Architectural");

    const disciplines = project.disciplines || [];

    // Find the selected discipline content
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

    // Convert parsed object to array of key-value pairs for rendering
    const renderSpecs = (obj: any) => {
        if (!obj) return <div style={{ color: '#666', padding: '2rem 0' }}>No data extracted for this discipline layer.</div>;

        if (typeof obj !== 'object') {
            return <div style={{ padding: '1rem 0' }}>{String(obj)}</div>;
        }

        return Object.entries(obj).map(([key, value], i) => (
            <div key={i} className="specs-grid">
                <div className="specs-label" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>{key}</div>
                <div style={{ fontFamily: 'var(--font-mono)' }}>
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </div>
            </div>
        ));
    };

    return (
        <div>
            <div style={{ marginBottom: '3rem' }}>
                <h2>{project.title}</h2>
                <div style={{ display: 'flex', gap: '2rem', color: '#666', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginTop: '1rem', fontSize: '0.9rem' }}>
                    <div><strong>LOCATION:</strong> {project.location}</div>
                    <div><strong>TYPOLOGY:</strong> {project.typology}</div>
                    <div><strong>YEAR:</strong> {project.year}</div>
                    <div>
                        <strong>STATUS:</strong>
                        <span style={{
                            marginLeft: '0.5rem',
                            color: project.fikraVerificationStatus === 'Pending' ? 'var(--eng-gold)' : 'var(--arch-teal)'
                        }}>
                            {project.fikraVerificationStatus}
                        </span>
                    </div>
                </div>
            </div>

            <div className="toggles">
                <button
                    className={`toggle-btn arch ${activeType === 'Architectural' ? 'active' : ''}`}
                    onClick={() => setActiveType('Architectural')}
                >
                    Architectural
                </button>
                <button
                    className={`toggle-btn eng ${activeType === 'Structural' ? 'active' : ''}`}
                    onClick={() => setActiveType('Structural')}
                >
                    Structural
                </button>
                <button
                    className={`toggle-btn eng ${activeType === 'MEP' ? 'active' : ''}`}
                    onClick={() => setActiveType('MEP')}
                >
                    MEP
                </button>
            </div>

            <div>
                <h3 style={{
                    color: activeType === 'Architectural' ? 'var(--arch-teal)' : 'var(--eng-gold)',
                    fontSize: '1.2rem',
                    marginBottom: '1rem'
                }}>
                    {activeType} Specifications
                </h3>

                <div style={{ marginTop: '1rem' }}>
                    {renderSpecs(parsedContent)}
                </div>
            </div>
        </div>
    );
}
