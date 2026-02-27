'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadArea() {
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                throw new Error('Upload failed');
            }

            const json = await res.json();
            if (json.success && json.data?.id) {
                router.push(`/project/${json.data.id}`);
                router.refresh();
            } else {
                throw new Error('Upload failed');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to parse document. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    if (isUploading) {
        return (
            <div className="loading-state">
                <div className="paper-plane">✈</div>
                <p>Fikra Engine parsing document...</p>
            </div>
        );
    }

    return (
        <div
            className="upload-area"
            onClick={() => document.getElementById('file-upload')?.click()}
        >
            <h2>Upload Architectural or Engineering Document</h2>
            <p style={{ color: '#666', marginTop: '1rem' }}>Accepts PDF & DOC files. The AI pipeline will automatically extract specs.</p>
            <input
                type="file"
                id="file-upload"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
            />
        </div>
    );
}
