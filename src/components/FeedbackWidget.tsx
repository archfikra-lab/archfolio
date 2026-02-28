'use client';

import { useState, useRef, useEffect } from "react";
import { submitFeedback } from "@/app/actions/feedback";
import { usePathname } from "next/navigation";

export default function FeedbackWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [feedbackType, setFeedbackType] = useState('suggestion');
    const pathname = usePathname();
    const formRef = useRef<HTMLFormElement>(null);

    // Reset success state when reopening
    useEffect(() => {
        if (isOpen && isSuccess) {
            setIsSuccess(false);
            if (formRef.current) formRef.current.reset();
        }
    }, [isOpen, isSuccess]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        formData.append("urlContext", pathname || "/");

        const result = await submitFeedback(formData);

        setIsSubmitting(false);
        if (result.success) {
            setIsSuccess(true);
            setTimeout(() => {
                setIsOpen(false);
            }, 3000);
        } else {
            alert(result.error || "Something went wrong.");
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Popover */}
            {isOpen && (
                <div className="mb-4 w-80 tracing-paper border border-[var(--electric-teal)] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
                    <div className="bg-[var(--electric-teal)] text-black px-4 py-3 flex items-center justify-between">
                        <span className="font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">chat_bubble</span>
                            Platform Feedback
                        </span>
                        <button onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </div>

                    <div className="p-5">
                        {isSuccess ? (
                            <div className="text-center py-6 text-[var(--electric-teal)]">
                                <span className="material-symbols-outlined text-4xl mb-2">check_circle</span>
                                <p className="text-sm font-medium">Thank you for your feedback!</p>
                            </div>
                        ) : (
                            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <p className="text-xs text-[var(--paper-plane-grey)] leading-relaxed">
                                    Notice an issue on this page? Have a suggestion for the platform? Let us know.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { id: 'suggestion', label: 'Suggestion' },
                                        { id: 'page', label: 'Page Issue' },
                                        { id: 'project', label: 'Project Data' },
                                        { id: 'data', label: 'Platform Data' },
                                        { id: 'other', label: 'Other' },
                                    ].map((t) => (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => setFeedbackType(t.id)}
                                            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border transition-colors ${feedbackType === t.id ? 'bg-[var(--electric-teal)] text-black border-[var(--electric-teal)]' : 'bg-[var(--midnight-charcoal)] text-[var(--paper-plane-grey)] border-[var(--ink-line)] hover:border-[var(--electric-teal)] hover:text-white'}`}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                    <input type="hidden" name="type" value={feedbackType} />
                                </div>
                                <textarea
                                    name="content"
                                    required
                                    rows={4}
                                    placeholder="Describe your feedback or technical issue..."
                                    className="w-full bg-[var(--midnight-charcoal)] border border-[var(--ink-line)] text-white text-sm p-3 outline-none focus:border-[var(--electric-teal)] transition-colors resize-none"
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-white text-black font-bold uppercase tracking-widest text-[10px] py-2.5 hover:bg-[var(--electric-teal)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? "Submitting..." : (
                                        <>Submit <span className="material-symbols-outlined text-[12px]">send</span></>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 ${isOpen ? 'bg-[var(--midnight-charcoal)] border border-[var(--electric-teal)] text-[var(--electric-teal)]' : 'bg-[var(--electric-teal)] text-black'}`}
                aria-label="Give Feedback"
            >
                <span className="material-symbols-outlined text-2xl">
                    {isOpen ? 'close' : 'support_agent'}
                </span>
            </button>
        </div>
    );
}
