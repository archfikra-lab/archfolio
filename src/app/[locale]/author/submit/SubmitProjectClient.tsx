'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeDocumentAction } from '@/app/actions/gemini';
import { submitProjectAction } from '@/app/actions/project';

interface PrizeType {
    id: string;
    name: string;
    description: string | null;
}

export default function SubmitProjectClient({ activePrizes }: { activePrizes: PrizeType[] }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        shortDescription: '',
        location: '',

        // Architectural
        formal: '',
        materiality: '',
        programming: '',
        acoustics: '',
    });

    const [selectedPrizes, setSelectedPrizes] = useState<string[]>([]);
    const [uploadedAiDocument, setUploadedAiDocument] = useState<File | null>(null);

    const handlePrizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedPrizes(value);
    };

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
                    title: result.data.title || prev.title,
                    shortDescription: result.data.shortDescription || prev.shortDescription,
                    location: result.data.location || prev.location,
                    formal: result.data.formal || prev.formal,
                    materiality: result.data.materiality || prev.materiality,
                    programming: result.data.programming || prev.programming,
                    acoustics: result.data.acoustics || prev.acoustics,
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

            const architectural = {
                formal: formData.formal,
                materiality: formData.materiality,
                programming: formData.programming,
                acoustics: formData.acoustics
            };

            formDataObj.set('architecturalJson', JSON.stringify(architectural));
            formDataObj.set('selectedPrizes', JSON.stringify(selectedPrizes));

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
                    Add an architectural case study to the Archfolio database
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
                    <p className="text-sm text-[var(--paper-plane-grey)] mb-6">Import a comprehensive document (PDF, DOC) and let our AI extract and structure the case study data for you.</p>

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

                {/* Prizes Selection */}
                {activePrizes.length > 0 && (
                    <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-8 border-l-4 border-l-[var(--mustard-gold)]">
                        <h2 className="text-xl font-medium text-[var(--deep-teal)] mb-6 border-b border-[var(--ink-line)] pb-4">Awards & Prizes</h2>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Select won prizes (Multiple allowed)</label>
                        <select
                            multiple
                            value={selectedPrizes}
                            onChange={handlePrizeChange}
                            className="w-full bg-transparent border border-[var(--ink-line)] p-4 text-[var(--deep-teal)] focus:outline-none focus:border-[var(--electric-teal)] transition-colors min-h-[120px]"
                        >
                            {activePrizes.map((prize) => (
                                <option key={prize.id} value={prize.id} title={prize.description || ''}>
                                    {prize.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-[var(--paper-plane-grey)] mt-2">Hold Ctrl/Cmd to select multiple prizes.</p>
                    </div>
                )}

                {/* Case Study Analysis Sections */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-[var(--deep-teal)] flex items-center gap-3">
                        <span className="material-symbols-outlined text-[var(--electric-teal)]">dataset</span>
                        Case Study Analysis
                    </h2>

                    {/* Architectural */}
                    <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] p-8 border-l-4 border-l-[var(--electric-teal)]">
                        <h4 className="text-sm font-bold text-[var(--deep-teal)] mb-4">Architectural (The "Skin & Soul")</h4>
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
