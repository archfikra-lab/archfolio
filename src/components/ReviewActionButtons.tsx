'use client';

import { useState } from 'react';
import { reviewProjectAction } from '@/app/actions/review';

export default function ReviewActionButtons({ projectId }: { projectId: string }) {
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);

    const handleApprove = async () => {
        setIsApproving(true);
        try {
            await reviewProjectAction(projectId, 'APPROVED');
        } catch (error) {
            console.error(error);
        } finally {
            setIsApproving(false);
        }
    };

    const handleReject = async () => {
        setIsRejecting(true);
        try {
            await reviewProjectAction(projectId, 'REJECTED');
        } catch (error) {
            console.error(error);
        } finally {
            setIsRejecting(false);
        }
    };

    return (
        <div className="flex justify-end gap-2">
            <button
                onClick={handleReject}
                disabled={isApproving || isRejecting}
                className="bg-transparent border border-[var(--mustard-gold)] text-[var(--mustard-gold)] px-4 py-1.5 font-bold uppercase tracking-widest text-[10px] hover:bg-[var(--mustard-gold)] hover:text-black transition-colors disabled:opacity-50"
            >
                {isRejecting ? 'Processing...' : 'Request Revision'}
            </button>
            <button
                onClick={handleApprove}
                disabled={isApproving || isRejecting}
                className="bg-[var(--electric-teal)] text-black px-4 py-1.5 font-bold uppercase tracking-widest text-[10px] hover:bg-white transition-colors disabled:opacity-50"
            >
                {isApproving ? 'Processing...' : 'Approve'}
            </button>
        </div>
    );
}
