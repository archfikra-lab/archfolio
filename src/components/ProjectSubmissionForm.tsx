'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { submitProjectAction } from '@/app/actions/project';

const LocationPicker = dynamic(() => import('./LocationPicker'), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-[var(--midnight-charcoal)] animate-pulse flex items-center justify-center border border-[var(--ink-line)]"><span className="text-[var(--paper-plane-grey)] text-xs">Loading map...</span></div>
});

export default function ProjectSubmissionForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        if (coordinates) {
            formData.append('latitude', coordinates[0].toString());
            formData.append('longitude', coordinates[1].toString());
        }

        try {
            await submitProjectAction(formData);
            router.push('/author');
            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="tracing-paper border border-[var(--ink-line)] p-8 space-y-8">
            <div className="space-y-6">
                <h2 className="text-lg font-bold text-white uppercase tracking-widest border-b border-[var(--ink-line)] pb-4">General Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Project Title</label>
                        <input type="text" name="title" required className="w-full bg-[var(--midnight-charcoal)] border border-[var(--ink-line)] text-white p-3 text-sm focus:border-[var(--electric-teal)] outline-none transition-colors" placeholder="e.g. Zenith Tower" />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Location (City, Country)</label>
                        <input type="text" name="location" required className="w-full bg-[var(--midnight-charcoal)] border border-[var(--ink-line)] text-white p-3 text-sm focus:border-[var(--electric-teal)] outline-none transition-colors" placeholder="e.g. Dubai, UAE" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Short Description</label>
                    <textarea name="shortDescription" rows={3} className="w-full bg-[var(--midnight-charcoal)] border border-[var(--ink-line)] text-white p-3 text-sm focus:border-[var(--electric-teal)] outline-none transition-colors" placeholder="A brief summary of the project..." />
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">Detailed Content (Markdown Supported)</label>
                    <textarea name="content" required rows={6} className="w-full bg-[var(--midnight-charcoal)] border border-[var(--ink-line)] text-white p-3 text-sm focus:border-[var(--electric-teal)] outline-none transition-colors" placeholder="Comprehensive project details, methodology, and technical specifications..." />
                </div>
            </div>

            <div className="space-y-6 pt-4">
                <h2 className="text-lg font-bold text-white uppercase tracking-widest border-b border-[var(--ink-line)] pb-4">Geospatial Data (Map Location)</h2>
                <p className="text-xs text-[var(--paper-plane-grey)] leading-relaxed">Pinpoint the exact location of the project on the map. This will be used to generate geospatial views.</p>
                <LocationPicker onChange={(lat, lng) => setCoordinates([lat, lng])} />
                <div>
                    <label className="block text-xs uppercase tracking-widest text-[var(--paper-plane-grey)] mb-2">External Map Link (Optional)</label>
                    <input type="url" name="mapLink" className="w-full bg-[var(--midnight-charcoal)] border border-[var(--ink-line)] text-white p-3 text-sm focus:border-[var(--electric-teal)] outline-none transition-colors" placeholder="https://maps.google.com/..." />
                </div>
            </div>

            <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between border-b border-[var(--ink-line)] pb-4">
                    <h2 className="text-lg font-bold text-white uppercase tracking-widest">Attachments & Media</h2>
                    <button type="button" className="text-[10px] font-bold uppercase tracking-widest text-[var(--electric-teal)] flex items-center gap-1 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-sm">auto_awesome</span>
                        AI Assist (Auto-fill from files)
                    </button>
                </div>
                <div className="bg-[var(--midnight-charcoal)] border border-dashed border-[var(--ink-line)] p-10 text-center hover:border-[var(--electric-teal)] transition-colors cursor-pointer group">
                    <span className="material-symbols-outlined text-5xl text-[var(--paper-plane-grey)] group-hover:text-[var(--electric-teal)] mb-4 block transition-colors">cloud_upload</span>
                    <p className="text-sm text-white mb-2">Click or drag files here to upload</p>
                    <p className="text-[10px] uppercase tracking-widest text-[var(--paper-plane-grey)]">Supports JPG, PNG, PDF, DWG (Max 50MB total)</p>

                    {selectedFiles.length > 0 && (
                        <div className="mt-4 text-xs text-[var(--electric-teal)] flex flex-wrap gap-2 justify-center">
                            {selectedFiles.map((f, i) => (
                                <span key={i} className="bg-[var(--electric-teal)]/10 px-2 py-1 rounded-sm border border-[var(--electric-teal)]/30">
                                    {f.name}
                                </span>
                            ))}
                        </div>
                    )}

                    <input
                        type="file"
                        name="files"
                        multiple
                        className="hidden"
                        id="file-upload"
                        ref={fileInputRef}
                        onChange={(e) => {
                            if (e.target.files) {
                                setSelectedFiles(Array.from(e.target.files));
                            }
                        }}
                    />
                    <label htmlFor="file-upload" className="mt-6 inline-block bg-[var(--ink-line)] text-white px-6 py-2 text-[10px] uppercase font-bold tracking-widest hover:bg-[var(--platinum-sheen)] transition-colors cursor-pointer border border-[var(--paper-plane-grey)]/20">
                        Browse Files
                    </label>
                </div>
            </div>

            <div className="pt-8 border-t border-[var(--ink-line)] flex justify-end gap-4">
                <button type="button" onClick={() => router.back()} className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-white border border-[var(--ink-line)] hover:bg-[var(--ink-line)] transition-colors">
                    Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-8 py-4 text-xs font-bold uppercase tracking-widest bg-[var(--electric-teal)] text-black hover:bg-white transition-colors flex items-center gap-2">
                    {isSubmitting ? (
                        <>
                            <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                            Submitting...
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-sm">send</span>
                            Submit for Review
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
