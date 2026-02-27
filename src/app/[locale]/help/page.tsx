import Link from 'next/link';

export default function HelpPage() {
    return (
        <div className="min-h-[80vh] relative overflow-hidden flex flex-col items-center justify-center p-6 lg:p-12">
            {/* Background Map Grid purely for aesthetics */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
                backgroundImage: 'linear-gradient(var(--ink-line) 1px, transparent 1px), linear-gradient(90deg, var(--ink-line) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }}></div>

            <div className="max-w-3xl w-full z-10 text-center">
                <span className="material-symbols-outlined text-6xl text-[var(--electric-teal)] mb-6">help_center</span>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">Archfolio Support Central</h1>
                <p className="text-lg text-[var(--paper-plane-grey)] mb-12 max-w-2xl mx-auto">
                    Everything you need to navigate the platform, manage submissions, and understand the verification process.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] hover:border-[var(--electric-teal)]/50 transition-colors p-8 group">
                        <span className="material-symbols-outlined text-[var(--paper-plane-grey)] group-hover:text-[var(--electric-teal)] mb-4 block transition-colors">cloud_upload</span>
                        <h3 className="text-xl font-medium text-white mb-2">Submission Guide</h3>
                        <p className="text-[var(--paper-plane-grey)] text-sm leading-relaxed mb-6">Learn how to format your CAD files, extract metadata via AI, and submit your projects for architectural review.</p>
                        <Link href="#" className="text-[10px] uppercase tracking-widest text-[var(--electric-teal)] font-bold flex items-center gap-1">Read Guide <span className="material-symbols-outlined text-[12px]">arrow_forward</span></Link>
                    </div>

                    <div className="bg-[var(--card-bg)] border border-[var(--ink-line)] hover:border-[var(--mustard-gold)]/50 transition-colors p-8 group">
                        <span className="material-symbols-outlined text-[var(--paper-plane-grey)] group-hover:text-[var(--mustard-gold)] mb-4 block transition-colors">verified</span>
                        <h3 className="text-xl font-medium text-white mb-2">The Verification Process</h3>
                        <p className="text-[var(--paper-plane-grey)] text-sm leading-relaxed mb-6">Understand the criteria used by our Academic and Expert reviewers to assess structural and theoretical viability.</p>
                        <Link href="#" className="text-[10px] uppercase tracking-widest text-[var(--mustard-gold)] font-bold flex items-center gap-1">View Criteria <span className="material-symbols-outlined text-[12px]">arrow_forward</span></Link>
                    </div>
                </div>

                <div className="mt-12 pt-12 border-t border-[var(--ink-line)]">
                    <p className="text-sm text-[var(--paper-plane-grey)]">Still need help? <a href="mailto:support@archfolio.com" className="text-white underline hover:text-[var(--electric-teal)] transition-colors">Contact Support</a></p>
                </div>
            </div>
        </div>
    );
}
