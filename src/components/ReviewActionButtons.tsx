'use client';

import { useState } from 'react';
import { reviewProjectAction } from '@/app/actions/review';

export default function ReviewActionButtons({ projectId }: { projectId: string }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [feedbackContent, setFeedbackContent] = useState('');

    const handleApprove = async () => {
        setIsProcessing(true);
        try {
            await reviewProjectAction(projectId, 'APPROVED');
        } catch (error) {
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!feedbackContent.trim()) {
            alert("Please provide feedback for the rejection.");
            return;
        }

        setIsProcessing(true);
        try {
            await reviewProjectAction(projectId, 'REJECTED', {
                content: feedbackContent,
                urlContext: `/en/project/${projectId}`,
                type: 'revision_request'
            });
            setShowModal(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <div className="flex justify-end gap-2">
                <button
                    onClick={() => setShowModal(true)}
                    disabled={isProcessing}
                    className="bg-transparent border border-[var(--mustard-gold)] text-[var(--mustard-gold)] px-4 py-1.5 font-bold uppercase tracking-widest text-[10px] hover:bg-[var(--mustard-gold)] hover:text-black transition-colors disabled:opacity-50"
                >
                    {isProcessing ? 'Processing...' : 'Request Revision'}
                </button>
                <button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="bg-[var(--electric-teal)] text-black px-4 py-1.5 font-bold uppercase tracking-widest text-[10px] hover:bg-white transition-colors disabled:opacity-50"
                >
                    {isProcessing ? 'Processing...' : 'Approve'}
                </button>
            </div>

            {/* Reject/Revision Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-[var(--card-bg)] border border-[var(--mustard-gold)] w-full max-w-lg p-6 relative">
                        <button
                            onClick={() => !isProcessing && setShowModal(false)}
                            className="absolute top-4 right-4 text-[var(--paper-plane-grey)] hover:text-white"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <h3 className="text-xl font-bold text-[var(--mustard-gold)] mb-2 uppercase tracking-tight">Request Revision</h3>
                        <p className="text-sm text-[var(--paper-plane-grey)] mb-6">
                            Provide explicit technical or theoretical feedback for the contributing firm. They will be required to update the project data based on this assessment.
                        </p>

                        <textarea
                            value={feedbackContent}
                            onChange={(e) => setFeedbackContent(e.target.value)}
                            placeholder="e.g., The MEP specifications lack detailed HVAC load calculations. Please update the data layer..."
                            className="w-full bg-[var(--platinum-sheen)]/10 border border-[var(--ink-line)] text-[var(--deep-teal)] p-4 h-32 mb-6 focus:border-[var(--mustard-gold)] focus:ring-1 focus:ring-[var(--mustard-gold)] outline-none resize-none font-mono text-sm"
                        ></textarea>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={isProcessing}
                                className="px-6 py-2 text-[var(--paper-plane-grey)] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={isProcessing || !feedbackContent.trim()}
                                className="bg-[var(--mustard-gold)] text-black px-6 py-2 font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors disabled:opacity-50"
                            >
                                {isProcessing ? 'Submitting...' : 'Submit Feedback'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
