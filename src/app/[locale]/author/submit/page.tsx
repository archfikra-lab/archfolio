'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeDocumentAction } from '@/app/actions/gemini';
import { submitProjectAction } from '@/app/actions/project';

export default function SubmitProjectPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        shortDescription: '',
        location: '',

        // Cross-Disciplinary
        contextual: '',
        sustainability: '',
        regulatory: '',
        budget: '',

        // Architectural
        formal: '',
        materiality: '',
        programming: '',
        acoustics: '',

        // Structural
        foundation: '',
        lateral: '',
        grid: '',
        material: '',

        // MEP
        hvac: '',
        ventilation: '',
        water: '',

        // Electrical
        power: '',
        renewable: '',
        automation: ''
    });

    const [uploadedAiDocument, setUploadedAiDocument] = useState<File | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAnalyzeDocument = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!uploadedAiDocument) {
            alert('Please upload a document to analyze first.');
            return;
        }

        setIsAnalyzing(true);

        try {
            const fd = new FormData();
            fd.append('file', uploadedAiDocument);

            const result = await analyzeDocumentAction(fd);

            if (result.error) {
                alert('Analysis failed: ' + result.error);
            } else if (result.data) {
                setFormData(prev => ({
                    ...prev,
                    // Merge previous values with new AI extracted values, prioritizing AI values if they exist
                    title: result.data.title || prev.title,
                    shortDescription: result.data.shortDescription || prev.shortDescription,
                    location: result.data.location || prev.location,
                    contextual: result.data.contextual || prev.contextual,
                    sustainability: result.data.sustainability || prev.sustainability,
                    regulatory: result.data.regulatory || prev.regulatory,
                    budget: result.data.budget || prev.budget,
                    formal: result.data.formal || prev.formal,
                    materiality: result.data.materiality || prev.materiality,
                    programming: result.data.programming || prev.programming,
                    acoustics: result.data.acoustics || prev.acoustics,
                    foundation: result.data.foundation || prev.foundation,
                    lateral: result.data.lateral || prev.lateral,
                    grid: result.data.grid || prev.grid,
                    material: result.data.material || prev.material,
                    hvac: result.data.hvac || prev.hvac,
                    ventilation: result.data.ventilation || prev.ventilation,
                    water: result.data.water || prev.water,
                    power: result.data.power || prev.power,
                    renewable: result.data.renewable || prev.renewable,
                    automation: result.data.automation || prev.automation
                }));
            }
        } catch (err: any) {
            console.error(err);
            alert('An unexpected error occurred during analysis.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formDataObj = new FormData(e.currentTarget);

            // Build the JSON structures
            const crossDisciplinary = {
                contextual: formData.contextual,
                sustainability: formData.sustainability,
                regulatory: formData.regulatory,
                budget: formData.budget
            };
            const architectural = {
                formal: formData.formal,
                materiality: formData.materiality,
                programming: formData.programming,
                acoustics: formData.acoustics
            };
            const structural = {
                foundation: formData.foundation,
                lateral: formData.lateral,
                grid: formData.grid,
                material: formData.material
            };
            const mep = {
                hvac: formData.hvac,
                ventilation: formData.ventilation,
                water: formData.water
            };
            const electrical = {
                power: formData.power,
                renewable: formData.renewable,
                automation: formData.automation
            };

            // Set these as JSON strings in the form data
            formDataObj.set('crossDisciplinaryJson', JSON.stringify(crossDisciplinary));
            formDataObj.set('architecturalJson', JSON.stringify(architectural));
            formDataObj.set('structuralJson', JSON.stringify(structural));
            formDataObj.set('mepJson', JSON.stringify(mep));
            formDataObj.set('electricalJson', JSON.stringify(electrical));

            const result = await submitProjectAction(formDataObj);

            if (result?.success) {
                router.push('/author');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to submit project. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            <div>
                <h1 className="text-4xl font-bold text-[var(--deep-teal)] mb-2 tracking-tight">Submit a New Project</h1>
                <p className="text-[var(--paper-plane-grey)] text-sm uppercase tracking-widest">
                    Add a case study to the Archfolio database
                </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-10">
                {/* AI Analysis Section */}
                <div className="bg-[var(--card-bg)] border border-[var(--mustard-gold)] p-8 relative">
                    <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center bg-[var(--mustard-gold)]/10 text-[var(--mustard-gold)]">
                        <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    </div>
                    <h2 className="text-xl font-medium text-[var(--deep-teal)] mb-4 flex items-center gap-2">
                        AI-Powered Analysis
                    </h2>
                    <p className="text-sm text-[var(--paper-plane-grey)] mb-6">Import a comprehensive document (PDF, DOC) and let our AI extract and structure the case study data for you across all necessary disciplines.</p>

                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setUploadedAiDocument(e.target.files?.[0] || null)}
                            className="block w-full text-sm text-[var(--paper-plane-grey)] file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-[var(--platinum-sheen)]/50 file:text-[var(--deep-teal)] border border-[var(--ink-line)] hover:border-[var(--electric-teal)] transition-colors p-2 cursor-pointer"
                        />
                        <button
                            onClick={handleAnalyzeDocument}
                            disabled={!uploadedAiDocument || isAnalyzing}
                            className={`whitespace-nowrap px-6 py-3 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 transition-colors border ${isAnalyzing ? 'bg-[var(--card-bg)] border-[var(--ink-line)] text-[var(--paper-plane-grey)] cursor-wait' : 'bg-[var(--ink-line)] text-[var(--deep-teal)] border-[var(--paper-plane-grey)]/20 hover:bg-[var(--platinum-sheen)]'}`}
                        >
                            {isAnalyzing ? (
                                <><span className="material-symbols-outlined text-sm animate-spin">refresh</span> Analyzing...</>
                            ) : (
                                <><span className="material-symbols-outlined text-sm text-[var(--mustard-gold)]">document_scanner</span> Analyze Document</>
                            )}
                        </button>
                    </div>
                </div>

                {/* Basic Info */}
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-8">
                    <h2 className="text-xl font-medium text-[var(--deep-teal)] mb-6 border-b border-[var(--ink-line)] pb-4">Project Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Project Title</label>
                            <input required name="title" value={formData.title} onChange={handleInputChange} type="text" placeholder="e.g., Urban Oasis Tower" className="w-full bg-transparent border border-[var(--ink-line)] p-4 text-[var(--deep-teal)] focus:outline-none focus:border-[var(--electric-teal)] transition-colors" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Location</label>
                            <input required name="location" value={formData.location} onChange={handleInputChange} type="text" placeholder="e.g., Downtown Dubai, UAE" className="w-full bg-transparent border border-[var(--ink-line)] p-4 text-[var(--deep-teal)] focus:outline-none focus:border-[var(--electric-teal)] transition-colors" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Short Description</label>
                            <input required name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} type="text" placeholder="A brief, one-sentence summary of the project." className="w-full bg-transparent border border-[var(--ink-line)] p-4 text-[var(--deep-teal)] focus:outline-none focus:border-[var(--electric-teal)] transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Case Study Analysis Sections */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-[var(--deep-teal)] flex items-center gap-3">
                        <span className="material-symbols-outlined text-[var(--electric-teal)]">dataset</span>
                        Case Study Analysis
                    </h2>

                    {/* Layer 1: Cross-Disciplinary */}
                    <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-8">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--mustard-gold)] mb-6 border-b border-[var(--ink-line)] pb-2 flex items-center justify-between">
                            1. Cross-Disciplinary Aspects (General)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Contextual Analysis</label>
                                <textarea name="contextual" value={formData.contextual} onChange={handleInputChange} placeholder="Climate data, site orientation, zoning..." rows={3} className="w-full bg-transparent text-sm border border-[var(--ink-line)] p-4 text-[var(--deep-teal)] focus:outline-none focus:border-[var(--electric-teal)] transition-colors resize-none"></textarea>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Sustainability Metrics</label>
                                <textarea name="sustainability" value={formData.sustainability} onChange={handleInputChange} placeholder="LEED rating, carbon footprint, life-cycle..." rows={3} className="w-full bg-transparent text-sm border border-[var(--ink-line)] p-4 text-[var(--deep-teal)] focus:outline-none focus:border-[var(--electric-teal)] transition-colors resize-none"></textarea>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Regulatory Compliance</label>
                                <textarea name="regulatory" value={formData.regulatory} onChange={handleInputChange} placeholder="Fire safety, ADA, height restrictions..." rows={3} className="w-full bg-transparent text-sm border border-[var(--ink-line)] p-4 text-[var(--deep-teal)] focus:outline-none focus:border-[var(--electric-teal)] transition-colors resize-none"></textarea>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Budget & Timeline</label>
                                <textarea name="budget" value={formData.budget} onChange={handleInputChange} placeholder="Estimated cost, construction duration..." rows={3} className="w-full bg-transparent text-sm border border-[var(--ink-line)] p-4 text-[var(--deep-teal)] focus:outline-none focus:border-[var(--electric-teal)] transition-colors resize-none"></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Layer 2: Discipline-Specific */}
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mt-8 mb-4">
                        2. Discipline-Specific Analysis
                    </h3>

                    {/* Architectural */}
                    <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-8 border-l-4 border-l-[var(--electric-teal)]">
                        <h4 className="text-sm font-bold text-[var(--deep-teal)] mb-4">A. Architectural (The "Skin & Soul")</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Formal Strategy</label>
                                <input name="formal" value={formData.formal} onChange={handleInputChange} type="text" placeholder="Massing, spatial hierarchy..." className="w-full bg-transparent text-sm border border-[var(--ink-line)] p-3 text-[var(--deep-teal)] focus:outline-none focus:border-[var(--electric-teal)] transition-colors" />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Materiality</label>
                                <input name="materiality" value={formData.materiality} onChange={handleInputChange} type="text" placeholder="Envelope breakdown, U-values..." className="w-full bg-transparent text-sm border border-[var(--ink-line)] p-3 text-[var(--deep-teal)] focus:outline-none focus:border-[var(--electric-teal)] transition-colors" />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Programming</label>
                                <input name="programming" value={formData.programming} onChange={handleInputChange} type="text" placeholder="Usage split (e.g. 60% Office)..." className="w-full bg-transparent text-sm border border-[var(--ink-line)] p-3 text-[var(--deep-teal)] focus:outline-none focus:border-[var(--electric-teal)] transition-colors" />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Acoustics & Lighting</label>
                                <input name="acoustics" value={formData.acoustics} onChange={handleInputChange} type="text" placeholder="Daylight factor, sound attenuation..." className="w-full bg-transparent text-sm border border-[var(--ink-line)] p-3 text-[var(--deep-teal)] focus:outline-none focus:border-[var(--electric-teal)] transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* Structural */}
                    <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-8 border-l-4 border-l-[var(--mustard-gold)]">
                        <h4 className="text-sm font-bold text-[var(--deep-teal)] mb-4">B. Structural (The "Bones")</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Foundation System</label>
                                <input name="foundation" value={formData.foundation} onChange={handleInputChange} type="text" placeholder="Soil type, foundation choice..." className="w-full bg-transparent text-sm border border-[var(--ink-line)] p-3 text-[var(--deep-teal)] focus:outline-none focus:border-[var(--electric-teal)] transition-colors" />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Lateral System</label>
                                <input name="lateral" value={formData.lateral} onChange={handleInputChange} type="text" placeholder="Wind/seismic handling, shear walls..." className="w-full bg-transparent text-sm border border-[var(--ink-line)] p-3 text-[var(--deep-teal)] focus:outline-none focus:border-[var(--electric-teal)] transition-colors" />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Primary Grid/Spans</label>
                                <input name="grid" value={formData.grid} onChange={handleInputChange} type="text" placeholder="Max clear spans, column spacing..." className="w-full bg-transparent text-sm border border-[var(--ink-line)] p-3 text-[var(--deep-teal)] focus:outline-none focus:border-[var(--electric-teal)] transition-colors" />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Material Strength</label>
                                <input name="material" value={formData.material} onChange={handleInputChange} type="text" placeholder="Concrete grade, steel yield..." className="w-full bg-transparent text-sm border border-[var(--ink-line)] p-3 text-[var(--deep-teal)] focus:outline-none focus:border-[var(--electric-teal)] transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* MEP & Electrical */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-8 border-l-4 border-l-[var(--paper-plane-grey)]">
                            <h4 className="text-sm font-bold text-[var(--deep-teal)] mb-4">C. MEP ("Circulation")</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] mb-1">HVAC System</label>
                                    <input name="hvac" value={formData.hvac} onChange={handleInputChange} type="text" className="w-full bg-transparent text-sm border border-[var(--ink-line)] p-2 text-[var(--deep-teal)] focus:outline-none focus:border-[var(--electric-teal)]" />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] mb-1">Ventilation</label>
                                    <input name="ventilation" value={formData.ventilation} onChange={handleInputChange} type="text" className="w-full bg-transparent text-sm border border-[var(--ink-line)] p-2 text-[var(--deep-teal)] focus:outline-none focus:border-[var(--electric-teal)]" />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] mb-1">Water Management</label>
                                    <input name="water" value={formData.water} onChange={handleInputChange} type="text" className="w-full bg-transparent text-sm border border-[var(--ink-line)] p-2 text-[var(--deep-teal)] focus:outline-none focus:border-[var(--electric-teal)]" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-8 border-l-4 border-l-[var(--paper-plane-grey)]">
                            <h4 className="text-sm font-bold text-[var(--deep-teal)] mb-4">D. Electrical & ICT</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] mb-1">Power Density</label>
                                    <input name="power" value={formData.power} onChange={handleInputChange} type="text" className="w-full bg-transparent text-sm border border-[var(--ink-line)] p-2 text-[var(--deep-teal)] focus:outline-none focus:border-[var(--electric-teal)]" />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] mb-1">Renewable Energy</label>
                                    <input name="renewable" value={formData.renewable} onChange={handleInputChange} type="text" className="w-full bg-transparent text-sm border border-[var(--ink-line)] p-2 text-[var(--deep-teal)] focus:outline-none focus:border-[var(--electric-teal)]" />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] mb-1">Automation (BMS)</label>
                                    <input name="automation" value={formData.automation} onChange={handleInputChange} type="text" className="w-full bg-transparent text-sm border border-[var(--ink-line)] p-2 text-[var(--deep-teal)] focus:outline-none focus:border-[var(--electric-teal)]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attachments */}
                <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-8">
                    <h2 className="text-xl font-medium text-[var(--deep-teal)] mb-6 border-b border-[var(--ink-line)] pb-4">Project Files & Attachments</h2>
                    <input type="file" name="files" multiple accept="image/*,.pdf,.doc,.docx,.dwg" className="block w-full text-sm text-[var(--paper-plane-grey)] file:mr-4 file:py-3 file:px-6 file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-[var(--ink-line)] file:text-[var(--deep-teal)] hover:file:bg-[var(--platinum-sheen)] cursor-pointer" />
                    <p className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)] mt-3">Upload high-res photos, architectural plans, and PDF documents. Max 50MB per file.</p>
                </div>

                {/* Submit Toolbar */}
                <div className="flex justify-end pt-6 border-t border-[var(--ink-line)] gap-4">
                    <button type="button" onClick={() => router.back()} className="px-6 py-3 font-bold uppercase tracking-widest text-[10px] text-[var(--paper-plane-grey)] hover:text-[var(--deep-teal)] transition-colors">
                        Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting} className="bg-[var(--electric-teal)] text-black px-8 py-3 font-bold uppercase tracking-widest text-[10px] hover:bg-[var(--drafting-white)] transition-colors flex items-center gap-2">
                        {isSubmitting ? (
                            <><span className="material-symbols-outlined text-sm animate-spin">refresh</span> Submitting...</>
                        ) : (
                            <><span className="material-symbols-outlined text-sm">publish</span> Submit Case Study</>
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
}
